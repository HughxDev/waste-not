$( document ).ready(function () {
  "use strict";

  var $upload = $('#upload');
  var $receipt = $('#receipt');
  var $progress = $('#progress');
  var $food = $('#food');
  var $loading = $('#loading');

  var expirations = {
    "grape-tomatoes": 10,
    "strawberries": 3,
    "green-grapes": 7,
    "red-delic-apples": 7,
    "broccoli-crowns": 14,
    "cauliflower": 21,
    "iceburg-lettuce": 10,
    "cucumbers": 10,
    "banana": 5,
    "restaur-tortilla": 7,
    "pretzelsticks/mini": 14
  };

  function getExpiration( food ) {
    var key = food.toLowerCase().replace( /\s/g, '-' );
    var expiration = expirations[ key ];

    console.log( key );

    if ( typeof expiration == 'undefined' || expiration <= 0 ) {
      expiration = 'Not enough data';
    } else {
      expiration = expiration.toString() + ' day(s)';
    }

    return expiration;
  }

  function ocr() {
    Tesseract.recognize( $receipt[0] )
      .progress( function ( message ) { console.log( message ); } )
      .catch( function ( err ) { console.error( err ); } )
      .then( function ( result ) { console.log( result ); } )
      .finally( function ( resultOrError ) {
        console.log( resultOrError );

        $loading.attr( 'hidden', '' );
        $receipt.attr( 'hidden', '' );

        var regex = /([^\n]+)\s+[0-9]+\.[0-9]{2}\sF3/g;

        var array = resultOrError.text.match( regex );

        var html = '';

        console.log( 'array', array );

        array.forEach( function ( element ) {
          var foodName = element.replace( regex, '$1' ).replace( /\sWE/, '' );

          html += '<li><span class="food-name">'
            + foodName
            + '</span>'
            + '<span class="food-expiration">'
            + getExpiration( foodName )
            + '</span></li>'
          ;
        } );

        $food.html( html );
      } )
    ;
  }

  function readURL( input ) {
    // console.log( 'readURL' );

    if ( input.files && input.files[0] ) {
      var reader = new FileReader();

      reader.onload = function ( event ) {
        $receipt.attr( 'src', event.target.result );

        $receipt.on( 'load', function ( event ) {
          ocr();
        } );
      }

      reader.readAsDataURL( input.files[0] );
    }
  }

  $upload.on( 'change', function () {
    $loading.attr( 'hidden', null );
    $receipt.attr( 'hidden', null );
    readURL( this );
  } );
} );