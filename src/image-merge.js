'use strict'

const fs = require('fs')
const gm = require('gm')
const _ = require('lodash')
const thunkify = require('thunkify')

function run(genFn){
  var args = Array.prototype.slice.call(arguments, 1)
  var gen = genFn.apply(null, args);

  next();
  function next(er,value){
    if(er) return gen.throw(er);
    var continuable = gen.next(value);

    if(continuable.done) return;
    var cbFn = continuable.value;
    cbFn(next);
  }
}

function* handleImages(files, outputPath, direction, background, maxWidth, maxHeight) {
  // console.log(arguments)
  let image = gm()
  _.reduce(files, (_image, file) => {
    _image.append(file)
    return _image
  }, image)

  let mw = 0
  let mh = 0

  if (direction === 'horizontal') {
    image.append(true)
  }

  for (let file of files) {
    let _image = gm(file)
    let _thunkifiedSizeFn = thunkify(_image.size.bind(_image))
    let _size = yield _thunkifiedSizeFn()
    if (direction === 'horizontal') {
      mw += _size.width
      mh = Math.max(mh, _size.height)
    } else {
      mw = Math.max(mw, _size.width)
      mh += _size.height
    }
  }

  if (maxWidth === 0) {
    maxWidth = mw
  } else if (maxWidth > mw) {
    maxWidth = mw
  }

  if (maxHeight === 0) {
    maxHeight = mh
  } else if (maxHeight > mh) {
    maxHeight = mh
  }

  image.background(background)
  console.log('maxWidth=' + maxWidth, 'maxHeight=' + maxHeight)

  let _thunkifiedWriteFn = thunkify(image.write.bind(image))
  yield _thunkifiedWriteFn(outputPath)
  console.log('Image merged!')

  gm(outputPath).resize(maxWidth, maxHeight).write(outputPath, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Image saved!')
    }
  })
}

/**
 *
 */
module.exports = function(files, outputPath, direction='vertical', background='#FFFFFF', maxWidth=0, maxHeight=0) {
  run(handleImages, files, outputPath, direction, background, maxWidth, maxHeight)
}