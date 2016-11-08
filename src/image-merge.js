'use strict'

class A {
  constructor(props) {
    console.log('AAAA')
  }
}

class B extends A {
  constructor(props) {
    super(props);

    console.log('BBBB')
  }
}

module.exports = function() {
  console.log('hello')
  new B()
}