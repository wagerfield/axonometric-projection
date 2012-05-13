/**
 * Build script for Axonometric Projection.
 *
 * @author Matthew Wagerfield
 * @see http://twitter.com/mwagerfield
 */
var FILE_ENCODING = 'utf-8',
    FILE_SYSTEM = require('fs'),
    UGLIFY = require('uglify-js'),
    LICENSE_FILE = 'license.js',
    SOURCE_DIRECTORY = '../source',
    DEPLOY_DIRECTORY = '../deploy',
    CONCATENATED_FILE = DEPLOY_DIRECTORY + '/ap.js',
    MINIFIED_FILE = DEPLOY_DIRECTORY + '/ap.min.js',
    SEPARATOR = '\n\n';

var license = FILE_SYSTEM.readFileSync(LICENSE_FILE, FILE_ENCODING);

/**
 * Concatenates a list of files into a single file.
 *
 * @param {Array} fileList List of file paths to concatenate.
 * @param {String} outputPath Path of the output file.
 */
function concatenate(fileList, outputPath) {

    var contentList = fileList.map(function(filePath){
        return FILE_SYSTEM.readFileSync(filePath, FILE_ENCODING);
    });
    contentList.unshift(license);

    FILE_SYSTEM.writeFileSync(outputPath, contentList.join(SEPARATOR), FILE_ENCODING);

    var log = 'CONCATENATED:';
    for (var i = 0, l = fileList.length; i < l; i++) log += '\n> ' + fileList[i];
    log += '\nINTO: ' + outputPath;
    console.log(log);
}

/**
 * Minifies a file using Uglify JS.
 *
 * @param {String} filePath The file to minify.
 * @param {String} outputPath Path of the output file.
 */
function uglify(filePath, outputPath) {
    
    var jsp = UGLIFY.parser,
        pro = UGLIFY.uglify,
        ast = jsp.parse(FILE_SYSTEM.readFileSync(filePath, FILE_ENCODING));

    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);

    FILE_SYSTEM.writeFileSync(outputPath, pro.gen_code(ast), FILE_ENCODING);

    console.log('UGLIFIED:', filePath, 'INTO:', outputPath);
}

concatenate([
    SOURCE_DIRECTORY + '/AP.js',
    SOURCE_DIRECTORY + '/Math.js',
    SOURCE_DIRECTORY + '/Matrix.js',
    SOURCE_DIRECTORY + '/Quaternion.js',
    SOURCE_DIRECTORY + '/Scene.js',
    SOURCE_DIRECTORY + '/Node.js'
],  CONCATENATED_FILE);

uglify(CONCATENATED_FILE, MINIFIED_FILE);