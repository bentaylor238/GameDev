let MyGame = {
  screens : {},
  input: {},
  objects: {},
  render: {},
  audio: {},
  assets: {}
};


//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame.loader = (function() {
  'use strict';
  let scriptOrder = [{
          scripts: ['input-keyboard'],
          message: 'Inputs loaded',
          onComplete: null
      }, {
          scripts: ['render/core', 'render/random-nums'],
          message: 'Rendering core loaded',
          onComplete: null
      }, {
          scripts: ['objects/background', 'objects/particle-system-guts', 'objects/particle-system-sparkle', 'objects/sprite2', 'objects/movers/mover', 'objects/movers/alligator', 'objects/movers/turtle', 'objects/movers/vehicles', 'objects/movers/river', 'objects/sprite', 'objects/lives', 'objects/frog', 'objects/lillipad', 'objects/system'],
          message: 'Objects loaded',
          onComplete: null
      }, {
          scripts: ['audio/background', 'audio/hop', 'audio/sinking', 'audio/squish', 'audio/reached-goal', 'audio/low-time'],
          message: 'Audio loaded',
          onComplete: null
      }, {
          scripts: ['game'],
          message: 'Game loaded',
          onComplete: null
      }, {
        scripts: ['screens/about', 'screens/gameplay', 'screens/highscores', 'screens/mainmenu', 'screens/options'],
        message: 'Screens loaded',
        onComplete: null
      }];
  let assetOrder = [{
          // Source: http://www.xojo3d.com/tut015.php
          // License: Public domain as noted at the bottom of the page
          key: 'guts',
          source: '/assets/guts.png'
      }, {
          key: 'sparkle',
          source: '/assets/sparkle.png'
      }, {
          key: 'background',
          source: '/assets/background.png'
      }, {
          key: 'bug',
          source: '/assets/bug.png'
      }, {
          key: 'car1',
          source: '/assets/car1.png'
      }, {
          key: 'car2',
          source: '/assets/car2.png'
      }, {
          key: 'car3',
          source: '/assets/car3.png'
      }, {
          key: 'frog-sprites',
          source: '/assets/frog-sprites.png'
      }, {
          key: 'lillipad',
          source: '/assets/lillipad.png'
      }, {
          key: 'log1',
          source: '/assets/log1.png'
      }, {
          key: 'log2',
          source: '/assets/log2.png'
      }, {
          key: 'log3',
          source: '/assets/log3.png'
      }, {
          key: 'truck1',
          source: '/assets/truck1.png'
      }, {
          key: 'truck2',
          source: '/assets/truck2.png'
      }, {
          key: 'turtle',
          source: '/assets/turtles.png'
      }, {
          key: 'alligator-sprites',
          source: '/assets/alligator.png'
      }, {
          key: 'background',
          source: '/audio/background.mp3'
      }, {
          key: 'hop',
          source: '/audio/frog-hop.mp3'
      }, {
          key: 'sinking',
          source: '/audio/sinking.mp3'
      }, {
          key: 'squish',
          source: '/audio/frog-squash.mp3'
      }, {
          key: 'reached-goal',
          source: '/audio/frog-success.mp3'
      }, {
          key: 'low-time',
          source: '/audio/low-time.mp3'
      }];

  //------------------------------------------------------------------
  //
  // Helper function used to load scripts in the order specified by the
  // 'scripts' parameter.  'scripts' expects an array of objects with
  // the following format...
  //    {
  //        scripts: [script1, script2, ...],
  //        message: 'Console message displayed after loading is complete',
  //        onComplete: function to call when loading is complete, may be null
  //    }
  //
  //------------------------------------------------------------------
  function loadScripts(scripts, onComplete) {
      //
      // When we run out of things to load, that is when we call onComplete.
      if (scripts.length > 0) {
          let entry = scripts[0];
          require(entry.scripts, function() {
              console.log(entry.message);
              if (entry.onComplete) {
                  entry.onComplete();
              }
              scripts.splice(0, 1);
              loadScripts(scripts, onComplete);
          });
      } else {
          onComplete();
      }
  }

  //------------------------------------------------------------------
  //
  // Helper function used to load assets in the order specified by the
  // 'assets' parameter.  'assets' expects an array of objects with
  // the following format...
  //    {
  //        key: 'asset-1',
  //        source: 'asset/url/asset.png'
  //    }
  //
  // onSuccess is invoked per asset as: onSuccess(key, asset)
  // onError is invoked per asset as: onError(error)
  // onComplete is invoked once per 'assets' array as: onComplete()
  //
  //------------------------------------------------------------------
  function loadAssets(assets, onSuccess, onError, onComplete) {
      //
      // When we run out of things to load, that is when we call onComplete.
      if (assets.length > 0) {
          let entry = assets[0];
          loadAsset(entry.source,
              function(asset) {
                  onSuccess(entry, asset);
                  assets.splice(0, 1);
                  loadAssets(assets, onSuccess, onError, onComplete);
              },
              function(error) {
                  onError(error);
                  assets.splice(0, 1);
                  loadAssets(assets, onSuccess, onError, onComplete);
              });
      } else {
          onComplete();
      }
  }

  //------------------------------------------------------------------
  //
  // This function is used to asynchronously load image and audio assets.
  // On success the asset is provided through the onSuccess callback.
  // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
  //
  //------------------------------------------------------------------
  function loadAsset(source, onSuccess, onError) {
      let xhr = new XMLHttpRequest();
      let asset = null;
      let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

      if (fileExtension) {
          xhr.open('GET', source, true);
          xhr.responseType = 'blob';

          xhr.onload = function() {
              if (xhr.status === 200) {
                  if (fileExtension === 'png' || fileExtension === 'jpg') {
                      asset = new Image();
                  } else if (fileExtension === 'mp3') {
                      asset = new Audio();
                  } else {
                      if (onError) { onError('Unknown file extension: ' + fileExtension); }
                  }
                  asset.onload = function() {
                      window.URL.revokeObjectURL(asset.src);
                  };
                  asset.src = window.URL.createObjectURL(xhr.response);
                  if (onSuccess) { onSuccess(asset); }
              } else {
                  if (onError) { onError('Failed to retrieve: ' + source); }
              }
          };
      } else {
          if (onError) { onError('Unknown file extension: ' + fileExtension); }
      }

      xhr.send();
  }

  //------------------------------------------------------------------
  //
  // Called when all the scripts are loaded, it kicks off the demo app.
  //
  //------------------------------------------------------------------
  function mainComplete() {
      console.log('it is all loaded up');
      MyGame.game.initialize();
  }

  //
  // Start with loading the assets, then the scripts.
  console.log('Starting to dynamically load project assets');
  loadAssets(assetOrder,
      function(source, asset) {    // Store it on success
          MyGame.assets[source.key] = asset;
      },
      function(error) {
          console.log(error);
      },
      function() {
          console.log('All assets loaded');
          console.log('Starting to dynamically load project scripts');
          loadScripts(scriptOrder, mainComplete);
      }
  );

}());