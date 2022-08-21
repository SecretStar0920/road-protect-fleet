## To make changes to cli
1. Add cli script in /cli/src/commands - make sure to extend BaseCommand or similar
2. Navigate to /cli/build and run `./build-deb.sh`
3. The output of the build can be found in /cli/dist
4. Copy /cli/dist/rp-cli_0.0.0_1_amd64.deb to / (allow overwriting of the existing deb file)
5. Run `sudo apt-get remove rp-cli`
6. Navigate to the root of the project folder and run: 

```
    sudo apt-get install ./rp-cli_0.0.0-1_amd64.deb
    rp-cli init
    rp-cli --help
```

If everything has been setup correctly, you should now see your command listed in the help.

// TODO: Consider changing the build command to deploy a new version of the cli so that running the deb file updates the existing installation without having to uninstall and reinstall
