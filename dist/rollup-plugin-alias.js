'use strict';
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
// Helper functions
var noop = function () {
  return null;
};
var matches = function (key, importee) {
  if (importee.length < key.length) {
    return false;
  }
  if (importee === key) {
    return true;
  }
  var importeeStartsWithKey = importee.indexOf(key) === 0;
  var importeeHasSlashAfterKey = importee.substring(key.length)[0] === '/';
  return importeeStartsWithKey && importeeHasSlashAfterKey;
};
var endsWith = function (needle, haystack) {
  return haystack.slice(-needle.length) === needle;
};
var isFilePath = function (id) {
  return (/^\.?\//.test(id)
  );
};
var exists = function (uri) {
  try {
    return fs.statSync(uri).isFile();
  } catch (e) {
    return false;
  }
};
var fileExists = function (uri) {
  try {
    return fs.statSync(uri).isFile();
  } catch (e) {
    return false;
  }
};
var directoryExists = function (uri) {
  try {
    return fs.statSync(uri).isDirectory();
  } catch (e) {
    return false;
  }
};
 
 
function alias() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var hasResolve = Array.isArray(options.resolve);
  var resolve = hasResolve ? options.resolve : ['.js'];
  var aliasKeys = hasResolve ? Object.keys(options).filter(function (k) {
    return k !== 'resolve';
  }) : Object.keys(options);
  // No aliases?
  if (!aliasKeys.length) {
    return {
      resolveId: noop
    };
  }
  return {
    resolveId: function (importee, importer) {
      // First match is supposed to be the correct one
      var toReplace = aliasKeys.find(function (key) {
        return matches(key, importee);
      });
      if (!toReplace) {
        return null;
      }
      var entry = options[toReplace];
      var updatedId = importee.replace(toReplace, entry);
   
   if (fileExists(updatedId))
   {
    return updatedId;
   }
   
   if (fileExists(updatedId + ".js"))
   {
    return updatedId + ".js";
   }
      
   if (directoryExists(updatedId))
   {
    if (fileExists(updatedId + "/index.js"))
    {
     return updatedId + "/index.js";
    } else
    {
     console.log("not index.js exists");
    }
   }
    
   
      if (isFilePath(updatedId)) {
    
        var directory = path.dirname(importer);
  
  
        // Resolve file names
        var filePath = path.resolve(directory, updatedId);
        var match = resolve.map(function (ext) {
          return '' + filePath + ext;
        }).find(exists);
        if (match) {
          return match;
        }
        // To keep the previous behaviour we simply return the file path
        // with extension
        if (endsWith('.js', filePath)) {
          return filePath;
        }
        return filePath + '.js';
      }
   
   console.log("not a file path");
      return updatedId; // + "/index.js";
    }
  };
}
module.exports = alias;
