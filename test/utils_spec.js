/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-04.
 *
 * File:
 * Description :
 */
'use strict';

const should = require('should');
const utils = require('./../built/utils');

describe('Fix case', function(){
  it('must return a object with snake_cases keys rather than camelCase ones.', function(){
    var data = {
      testKey : 'ok',
      test2 : 'ok',
      test_3 : 'ok',
      test4_Test : 'ok'
    };

    var result = utils.Utils.fixCase(data);

    result.should.eql({
      test_key : 'ok',
      test2 : 'ok',
      test_3 : 'ok',
      test4_Test : 'ok'
    })
  });
});