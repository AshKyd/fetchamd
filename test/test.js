function getfetchModule(cb){
    $.ajax({
        url: '../index.js',
        dataType: 'text',
        success: function(script){
            // Sneaky code to load up a commonjs module
            // this way we don't need a build task.
            script = '(function(){var module = {exports:{}};'+script+';return module.exports;});';
            var thisExport = (eval(script))();
            cb(thisExport);
        }
    });
}
describe('Require', function(){
    it('should init', function(done){
        getfetchModule(function(fetchModule){
            chai.assert(typeof fetchModule, 'object');
            done();
        });
    });
    it('can load a single module.', function(done){
        getfetchModule(function(fetchModule){
            fetchModule(['requireable1.js'], function(item1){
                chai.assert(typeof item1, 'object');
                chai.assert(item1.name, 'item one');
                done();
            });
        });
    });
    it('can load multiple modules.', function(done){
        getfetchModule(function(fetchModule){
            fetchModule(['requireable1.js', 'requireable2.js'], function(item1, item2){
                chai.assert(typeof item1, 'object');
                chai.assert(typeof item2, 'object');
                chai.assert(item1.name, 'item one');
                chai.assert(item2.name, 'item two');
                done();
            });
        });
    });
    it('can have multiple instances.', function(done){
        getfetchModule(function(fetchModule1){
            getfetchModule(function(fetchModule2){
                chai.assert(fetchModule1 !== fetchModule2, true);

                var i = 0;
                fetchModule1(['requireable1.js'], function(item){
                    chai.assert(typeof item, 'object');
                    chai.assert(item.name, 'item one');
                    if(++i === 2){
                        done();
                    }
                });
                fetchModule2(['requireable2.js'], function(item){
                    chai.assert(typeof item, 'object');
                    chai.assert(item.name, 'item two');
                    if(++i === 2){
                        done();
                    }
                });
            });
        });
    });
    it('can load a Browserified standalone module.', function(done){
        getfetchModule(function(fetchModule){
            fetchModule(['requireable3-browserify.js'], function(item3){
                chai.assert(typeof item3, 'number');
		// item3 exports the number 5.
                chai.assert(item3, 5);
                done();
            });
        });
    });
})
