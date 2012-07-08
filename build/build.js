/**
 * Build script for Axonometric Projection Engine.
 *
 * @author Matthew Wagerfield
 * @author Carl Calderon
 * @see http://twitter.com/mwagerfield
 */
var FILE_ENCODING     = 'utf-8',
    LICENSE_FILE      = '../LICENSE',
    SOURCE_DIRECTORY  = '../source',
    DEPLOY_DIRECTORY  = '../deploy',
    CONCATENATED_FILE = DEPLOY_DIRECTORY + '/ape.js',
    MINIFIED_FILE     = DEPLOY_DIRECTORY + '/ape.min.js',
    SEPARATOR         = '\n',

    fs      = require('fs'),
    uglify  = require('uglify-js'),
    content = '',
    license = fs.readFileSync(LICENSE_FILE, FILE_ENCODING);

/**
 * Concatenates a list of files into a single file.
 *
 * @param {Array} fileList List of file paths to concatenate.
 * @return {String} Concatenated file contents
 */
function concatenate(fileList) {

    console.log('CONCATENATED:');
    contentList = fileList.map(function (filePath) {
        console.log('> ' + filePath);
        return fs.readFileSync(filePath, FILE_ENCODING);
    });
    return contentList.join(SEPARATOR);
}

/**
 * Minifies a file using Uglify JS.
 *
 * @param {String} content Content to minify
 * @return {String} Minified version
 */
function minify(content) {
    var result = uglify(content),
        sizeBefore = content.length,
        sizeAfter = result.length;
    console.log('UGLIFY REDUCED: ' + ((1 - (sizeAfter / sizeBefore)) * 100).toFixed(2) + '%');
    return result;
}

/**
 * Writes a string to a file.
 *
 * @param {String} content Content to write
 * @param {String} to File path
 */
function write(content, to) {
    fs.writeFileSync(to, content, FILE_ENCODING);
    console.log('INTO: ' + to);
}

/**
 * Adds a string to the beginning of another
 * string separated by SEPARATOR.
 *
 * @param {String} content Content to add
 * @param {String} to String to prepend
 * @return {String} Combined content
 */
function prepend(content, to) {
    return content + SEPARATOR + to;
}

// combine files
content = concatenate([
    SOURCE_DIRECTORY + '/APE.js',
    SOURCE_DIRECTORY + '/Math.js',
    SOURCE_DIRECTORY + '/Matrix.js',
    SOURCE_DIRECTORY + '/Quaternion.js',
    SOURCE_DIRECTORY + '/Scene.js',
    SOURCE_DIRECTORY + '/Node.js'
]);

// write uncompressed
write(prepend(license, content), CONCATENATED_FILE);

// write compressed
write(prepend(license, minify(content)), MINIFIED_FILE);
