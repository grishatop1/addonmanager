from typing import List
import webview
import os
import pickle
import subprocess

class App:
	def __init__(self) -> None:
		self.cache_path = os.getenv('APPDATA') + "\\AddonManager666\\"
		self.gmod_path = ""
		self.addons_path = ""
		self.aoffdons_path = ""

	def run(self):
		data = self.loadCacheFile()
		self.api = Api(self)
		self.window = webview.create_window('Addon Manager!', 
										'assets/index.html',
										frameless=True,
										min_size=(250,300),
										width=1270,
										height=720,
										on_top=True,
										js_api=self.api)
		self.api.window = self.window
		webview.start(debug=True)

	def loadCacheFile(self):
		os.makedirs(self.cache_path, exist_ok=True)
		open(self.cache_path+"cache", "a+").close()
		with open(self.cache_path+"cache") as f:
			data = f.read()
		return data

	def writeCacheFile(self, writeData):
		with open(self.cache_path+"cache", "w+") as f:
			f.write(writeData)

	def getAddons(self):
		self.active_addons = [x for x in os.listdir(self.addons_path)]
		self.inactive_addons = [x for x in os.listdir(self.aoffdons_path)]
		return (self.active_addons, self.inactive_addons)


class Api:
	def __init__(self, parent) -> None:
		self.parent = parent
		self.window = None

	def prestart(self):
		data = self.parent.loadCacheFile()
		if not data:
			return [True, None] #Load page-path page
		else:
			self.parent.addons_path = data
			self.parent.aoffdons_path = data[:-6] + "aoffdons"
			os.makedirs(self.parent.aoffdons_path, exist_ok=True)
			self.parent.gmod_path = data[:-16]
			return [False, self.parent.getAddons()] #Load main-page

	def openFileDialog(self):
		self.gmodpath = self.window.create_file_dialog(webview.FOLDER_DIALOG)[0]
		if not self.gmodpath:
			self.gmodpath = "You didn't select anything bro..."
		return self.gmodpath

	def initialStart(self):
		self.parent.writeCacheFile(self.gmodpath)

	def quit(self):
		self.window.destroy()

	def rungmod(self):
		os.startfile(self.parent.gmod_path+"Garrys_Mod.exe")

	def openexplorer(self):
		subprocess.Popen(fr'explorer /select,"{self.parent.addons_path}"')


if __name__ == '__main__':
	app = App()
	app.run()