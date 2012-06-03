(function(name, definition, context){

    context[ name ] = definition() 

})('invoke', function(){

   function Invokable( fn ) {

       this._root = this._curr = new InvokableStep( fn )  
   }    
 
   Invokable.prototype.then = function( fn ) {

       this._curr = this._curr.child( fn )

      return this
   }   

   Invokable.prototype.and = function( fn ) {

       this._curr.sibling( fn )
   }   

   Invokable.prototype.fire = function( passed, cb ) {

          this._root.exec(passed, cb)
   }    

   function InvokableStep( fn ) {

           this._fns = [ fn ]

           this._next = null
   }

  InvokableStep.prototype.child = function( fn ) {

          return this._next = new InvokableStep( fn )
  }

  InvokableStep.prototype.sibling = function( fn ) {

          this._fns.push( fn )
  }

  InvokableStep.prototype.exec = function( passed, cb ) {

         var self = this,
             completed = 0,
             i,
             results = [],
             len = this._fns.length


         function parallel(index, fn) {

                  return function() {
                      
                        fn(passed, function(data){

                             (len == 1) ? results = data : results[index] = data  

                             if(++completed == len) {

                                  self._next ? self._next.exec(results, cb) : cb(results)
                             }
                        })
                  }
         } 
         
         for(i=0; i < len;i++) parallel(i, this._fns[ i ] )()
  }
 
   return function( fn ) {

          return new Invokable( fn )
   } 

}, this)
