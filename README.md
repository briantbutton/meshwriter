# MeshWriter

Generate letters in BABYLON meshes.

## Javascript Calls And Parameters

### Usage Summary

	Writer    = BABYLON.MeshWriter(scene, {scale:scale});       // Returns re-usable constructor
	text1     = new Writer(                                     // Inserts text into scene, per options
	                   "ABC",
	                   {
	                       "anchor": "center",
	                       "letter-height": 50,
	                       "color": "#1C3870",
	                       "position": {
	                           "z": 20
  	                     }
	                    }
	             );
	textMesh  = text1.getMesh()                                 // Returns a regular BABYLON mesh, which can
	                                                            // be manipulated using standard methods

&#9679; Helvetica Neue playground example:&nbsp;  https://www.babylonjs-playground.com/#PL752W#53  
&#9679; Comic playground example:&nbsp;  https://www.babylonjs-playground.com/#PL752W#52

### Superconstructor - BABYLON.MeshWriter()

After MeshWriter is loaded (see below), BABYLON.MeshWriter is defined.  It is called with one or two parameters.  
&#9679; **scene** &nbsp; required  
&#9679; **preferences** &nbsp; optional &nbsp; The preferences object may specify up to three values

	      FIELD                 DEFAULT
	    default-font           Helvetica
	    scale                      1
	    letter-origin         "letter-center"

The call to BABYLON.MeshWriter returns a constructor.  Call it "**Writer**".

### Constructor - new Writer()

new Writer() is called with a string and an (optional) options parameter.&nbsp; The options object conforms to normal BabylonJS structures and terminology.

	      FIELD                 DEFAULT
	    font-family             default-font
	    anchor                  left
	    letter-height           100
	    letter-thickness        1
	    color                   #808080              # hits emissive only
	    alpha                   1
	    position
	        x                   0
	        y                   0
	        z                   0
	    colors                                       # if you need to control more than just emissive
	        diffuse             #F0F0F0
	        specular            #000000
	        ambient             #F0F0F0
	        emissive            color                # from option field 'color' above


**new Writer()** builds a mesh with material that is inserted into the scene.&nbsp; This is a multi-step process with interim meshes and holes per letter.&nbsp;  These meshes are sucked into an SPS and then disposed.&nbsp; At the end, one mesh, one material and one SPS have been added to the scene.

**new Writer()** also returns a **writer** instance with useful methods.&nbsp; See below.

### Instance

Each **writer** instance has methods to allow one to retrieve the BabylonJS objects or to get/set attributes of the SPS.

	   getSPS
	   getMesh
	   getMaterial
	   color                   # sets or gets color but no change to material
	   alpha                   # sets or gets alpha but no change to material
	   setColor                # set emissive color and change color value
	   setAlpha                # change value and material
	   overrideOpac            # change material but not value
	   resetOpac               # sets material to current value
	   dispose                 

### Usage Hints

If you wish to do extensive things with position, rotation or animation, retrieve the meshes and materials from the instance using the methods shown above.&nbsp; The output from **new Writer()** is an SPS with one particle for each character.

Colors:&nbsp; With most lighting, it is enough just to use the "color" field to specify the letter coloring.&nbsp; However, programmers may specify all four color types by putting a "colors" object in the options object.


### Font Families and Supported Glyphs

There are four font families available, 'Helvetica', 'HirukoPro-Book', 'Jura' and 'Comic'.&nbsp;
The default font, Helvetica, is probably the one you want.&nbsp;
If it is, no font family need be specified.&nbsp;
Also, Helvetica, has the most extensive characters and the fewest faces; it will be the most efficient if you have a lot of text.&nbsp;

	Helvetica
	"0","1","2","3","4","5","6","7","8","9",
	"a","á","à","ä","â","å","æ","b","c","ç","č","d","e","é","è","ë","ê","f","g","h","i","ı","í","ì","ï","î","j",
	"k","l","m","n","ñ","ń","o","ô","ò","ó","ö","p","q","r","s","t","u","ú","ù","ü","û","v","w","x","y","ÿ","z",
	"A","Á","À","Ã","Â","Ä","Å","Æ","B","C","D","E","É","È","Ê","Ë","F","G","H","I","J","K","L","M",
	"N","Ñ","O","Ó","Ò","Ô","Ö","Õ","P","Q","R","S","T","U","Ú","Ù","Û","Ü","V","W","X","Y","Z",
	"¡","!","|",'"',"'","#","$","%","&","{","}","(",")","*","+",",","-",".",
	"/",":",";","<","=",">","¿","?","@","[","]","^","_"," "

	Comic
	"0","1","2","3","4","5","6","7","8","9",
	"a","á","à","ä","â","å","æ","b","c","ç","d","e","é","è","ë","ê","f","g","h","i","ı","í","ì","ï","î","j",
	"k","l","m","n","ñ","o","ô","ò","ó","ö","p","q","r","s","t","u","ú","ù","ü","û","v","w","x","y","z",
	"A","Á","À","Ä","Â","Å","Æ","B","C","Ç","D","E","É","È","Ê","Ë","F","G","H","I",
	"J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z",
	"¡","!","|",'"',"'","#","$","%","&","(",")","*","+",",","-",".",
	"/",":",";","<","=",">","¿","?","@","[","]","{","}","^","_"," "

	Jura
	"0","1","2","3","4","5","6","7","8","9",
	"a","b","c","d","e","f","g","h","i","j","k","l","m",
	"n","o","p","q","r","s","t","u","v","w","x","y","z",
	"A","B","C","D","E","F","G","H","I","J","K","L","M",
	"N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
	"!","|",'"',"'","#","$","%","&","(",")","*","+",",",
	"-",".","/",":",";","<","=",">","?","@","[","]","^","_"," "

	HirukoPro
	"0","1","2","3","4","5","6","7","8","9",
	"A","B","C","D","E","F","G","H","I","J","K","L","M",
	"N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
	"a","b","c","d","e","f","g","h","i","j","k","l","m",
	"n","o","p","q","r","s","t","u","v","w","x","y","z",
	"%","#","$","&","?","!","|","(",")","-","_","=","+",",","."," "

As of last viewing, the total "meshwriter.min.js" file was under 120K.

**And:** Unless you are a font master, Helvetica and Arial are synonymous.


## Loading MeshWriter

Both meshwriter.js and meshwriter.min.js are all-inclusive and should be loadable in any of the normal ways (e.g. AMD).&nbsp;
BABYLON should be loaded first.&nbsp;
If BABYLON is already loaded, then MeshWriter will attach itself to BABYLON, allowing this call.

	Writer = BABYLON.MeshWriter(scene, {scale:scale});

Otherwise MeshWriter will attach to window.

### Earcut

Earcut is a simple, stable and small utility that is needed by PolygonMeshBuilder, which MeshWriter calls.&nbsp;
If you haven't otherwise loaded Earcut, do so; it is _not_ included in meshwriter.min.js.&nbsp;
The repo is here: https://github.com/mapbox/earcut.&nbsp;
And there is a recent version in this repo.


## Custom font packages

MeshWriter comes with only a few fonts.&nbsp;
Industrious folk with specific requirements can create a MeshWriter package with their own fonts.&nbsp;
Think of this as two steps.

1) Converting standard font files (.ttf or .otf) to MeshWriter font files, and
2) Creating your own minified build of MeshWriter with your chosen fonts.

MeshWriter-Font (https://github.com/briantbutton/meshwriter-font) addresses the first step.&nbsp;
It will convert most common font files into MeshWriter compatible font files.&nbsp;

To create a custom build (a new meshwriter.min.js) with your custom fonts, refer to the README in this repo in the 'fonts' directory.
