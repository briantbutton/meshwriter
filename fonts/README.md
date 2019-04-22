# So you want to build a 3-D font, eh?

A committed individual can transform an SVG-style path into something that MeshWriter will use.&nbsp;
An extremely committed individual can make a whole alphabet.&nbsp;
Here is the basic road map.

### The curves

The curves follow SVG-style rules, supporting SVG commands.  These include:
  ~ 'M' move to, only at the beginning
  ~ 'L' line, never at the beginning
  ~ 'l' line
  ~ 'Q' quadratic curve
  ~ 'q' quadratic curve
  ~ 'C' cubic curve
  ~ 'c' cubic curve

Just below is an example from Comic (a knarly font) showing the letter 'j' in SVG and in MeshWriter.&nbsp;
In MeshWriter, the commands are placed in arrays.&nbsp;
The length of the array indicates the command type.&nbsp;
  ~ 2: M or L
  ~ 3: l
  ~ 4: Q
  ~ 5: q
  ~ 6: C
  ~ 7: c

Since 'j' has two shapes, including the dot, the SVG shows two M commands. &nbsp;
In Meshwriter, this is two arrays, one for each shape, starting with the SVG M command.&nbsp;
So this means that shapeCmds has three levels.&nbsp;
At the top is an array containing all shapes, usually one or more.&nbsp;
Each shape is an array of commands, each command containing multiple coordinates.&nbsp;

	fullPath  : "M 233.5 632.5 Q 209.5 632.5 192 649.5 Q 175 666.5 175 690 Q 175 714 192 731 Q 209.5 748 233.5 748 Q 257.5 748 275 731 Q 292.5 714 292.5 690 Q 292.5 666.5 275 649.5 Q 257.5 632.5 233.5 632.5 Z M 229.5 -116 Q 230 -57.5 212.5 183.5 L 195.5 459 Q 195.5 484 209.5 503.5 Q 224 523 246 523 Q 263 523 280 510.5 Q 297 498 298 485 L 314.5 197 L 328 -111 Q 328 -180.5 286.5 -237 Q 241.5 -298.5 177 -298.5 Q 69.5 -298.5 -3 -133 Q -9 -119.5 -9 -109 Q -9 -89 6.5 -74.5 Q 22.5 -60 42.5 -60 Q 72 -60 104 -125 Q 112 -142 132 -174 Q 151.5 -199 177 -199 Q 199 -199 214.5 -166 Q 226.5 -141 229.5 -116 Z",
	shapeCmds : [[[233.5,632.5],[209.5,632.5,192,649.5],[175,666.5,175,690],[175,714,192,731],[209.5,748,233.5,748],[257.5,748,275,731],[292.5,714,292.5,690],[292.5,666.5,275,649.5],[257.5,632.5,233.5,632.5]],[[229.5,-116],[230,-57.5,212.5,183.5],[195.5,459],[195.5,484,209.5,503.5],[224,523,246,523],[263,523,280,510.5],[297,498,298,485],[314.5,197],[328,-111],[328,-180.5,286.5,-237],[241.5,-298.5,177,-298.5],[69.5,-298.5,-3,-133],[-9,-119.5,-9,-109],[-9,-89,6.5,-74.5],[22.5,-60,42.5,-60],[72,-60,104,-125],[112,-142,132,-174],[151.5,-199,177,-199],[199,-199,214.5,-166],[226.5,-141,229.5,-116]]],
	sC        : ['D¸K3 DfK3DBKU CÃKxCÃL% CÃLVDBLy DfL½D¸L½ EEL½EiLy E®LVE®L% E®KxEiKU EEK3D¸K3','D°?Z D±@ODlD1 DIHX DIH­DfI1 D¥IXE.IX EPIXEsI? E·I%E¹H¯ F7DL FR?e FR>YE¢=i E$<nD#<n BM<nA<?8 A0?SA0?i A0?³AO@- Ap@JAº@J BR@JBµ?H C!?%CJ>g Cr>4D#>4 DP>4Dp>w Dª?(D°?Z'],

The third version, sC is an encoded version, saving 45% of the space.&nbsp;
This may be handy should be eventually want a lot of fonts in one package.&nbsp;
The encoding is proprietary, simple and built into MeshWriter.&nbsp;
It puts an array of arrays into an ASCII string.&nbsp;

Furthermore it is optional; any given symbol may present either shapeCmds or sC.&nbsp;
I usually encode stable symbols after a while.



	Writer = BABYLON.MeshWriter(scene, {scale:scale});
	text1  = new Writer( 
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

&#9679; See playground example:
https://www.babylonjs-playground.com/#PL752W#22

### Superconstructor - BABYLON.MeshWriter()

After this module is loaded, BABYLON.MeshWriter is defined.  It is called with one or two parameters.
- **scene** &nbsp; required
- **preferences** &nbsp; optional &nbsp; The preferences object may specify up to three values

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


### Fonts

There are four font families available, 'Helvetica', 'HirukoPro-Book', 'Jura', 'Comic' and 'WebGL-Dings but you probably do not need to specify one.&nbsp; The default font, Helvetica, has the most extensive characters and the fewest faces; it will be the most efficient if you have a lot of text.&nbsp; Jura was added because the author likes it for numbers.

**Important:** Comic and Web-Dings are really just placeholders as of this writing, with only a few glyphs.

