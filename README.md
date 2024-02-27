This guide covers how to develop, build, and deploy the my-web-extension Firefox web extension.

## Prerequisites
- Node.js v12+
- npm package manager
- Firefox web browser

# Development
## Clone the repository
```bash
git clone https://github.com/Browser-Buddy/browser-buddy.git
```
## Enter the repository
```bash
cd browser-buddy
```
This project will use `web-ext` for building & running the addon. `web-ext` is a command line tool designed to speed up various parts of the extension development process, making development faster and easier. `web-ext` is a node-based application. You install it with brew or the nodejs npm tool.

Install with brew
```bash
brew install web-ext
```
Install with npm
```bash
npm install --global web-ext
```
*`web-ext` requires the current LTS (long-term support) versions of NodeJS.*

To test whether the installation worked run the following command, which displays the `web-ext` version number:
```bash
web-ext --version
```
`web-ext` will notify you when it is time to update to the newest version. To update your global install, use the command `npm install -g web-ext`.

## Running
To launch a demo firefox isntance with the addon pre-installed, go into the project's root directory and use:
```bash
web-ext run
```
