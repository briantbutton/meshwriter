/*!
 * Babylon MeshWriter
 * https://github.com/BabylonJS/Babylon.js
 * (c) 2018-2019 Brian Todd Button
 * Released under the MIT license
 */

define(
  ['./fonts/hirukopro-book','./fonts/helveticaneue-medium','./fonts/comicsans-normal','./fonts/jura-medium'],

  // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
  // This function loads the specific type-faces and returns the superconstructor
  // If BABYLON is loaded, it assigns the superconstructor to BABYLON.MeshWriter
  // Otherwise it assigns it to global variable 'BABYLONTYPE'

  function(HPB,HNM,CSN,JUR){

    var scene,FONTS,defaultColor,defaultOpac,naturalLetterHeight,curveSampleSize,Γ=Math.floor,hpb,hnm,csn,jur;
    var b128back=new Uint8Array(256),b128digits=new Array(128);
    prepArray();
    hpb                          = HPB(codeList);
    hnm                          = HNM(codeList);
    csn                          = CSN(codeList);
    jur                          = JUR(codeList);
    FONTS                        = {};
    FONTS["HirukoPro-Book"]      = hpb;
    FONTS["HelveticaNeue-Medium"]= hnm;
    FONTS["Helvetica"]           = hnm;
    FONTS["Arial"]               = hnm;
    FONTS["sans-serif"]          = hnm;
    FONTS["Comic"]               = csn;
    FONTS["comic"]               = csn;
    FONTS["ComicSans"]           = csn;
    FONTS["Jura"]                = jur;
    FONTS["jura"]                = jur;
    defaultColor                 = "#808080";
    defaultOpac                  = 1;
    curveSampleSize              = 6;
    naturalLetterHeight          = 1000;

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    //  SUPERCONSTRUCTOR  SUPERCONSTRUCTOR  SUPERCONSTRUCTOR 
    // Parameters:
    //   ~ scene
    //   ~ preferences

    var Wrapper                  = function(){

      var proto,defaultFont,scale,meshOrigin,preferences;

      scene                      = arguments[0];
      preferences                = makePreferences(arguments);

      defaultFont                = NNO(FONTS[preferences.defaultFont]) ? preferences.defaultFont : "HelveticaNeue-Medium";
      meshOrigin                 = preferences.meshOrigin==="fontOrigin" ? preferences.meshOrigin : "letterCenter";
      scale                      = tyN(preferences.scale)?preferences.scale:1;

      // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
      //  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR
      // Called with 'new'
      // Parameters:
      //   ~ letters
      //   ~ options

      function MeshWriter(lttrs,opt){
        var options              = NNO(opt) ? opt : { } ,
            position             = setOption("position", NNO, {}),
            colors               = setOption("colors", NNO, {}),
            fontFamily           = setOption("font-family", supportedFont, defaultFont),
            anchor               = setOption("anchor", supportedAnchor, "left"),
            rawheight            = setOption("letter-height", PN, 100),
            rawThickness         = setOption("letter-thickness", PN, 1),
            basicColor           = setOption("color", NES, defaultColor),
            opac                 = setOption("alpha", Amp, defaultOpac),
            y                    = setPositn("y", tyN, 0),
            x                    = setPositn("x", tyN, 0),
            z                    = setPositn("z", tyN, 0),
            diffuse              = setColor("diffuse", NES, "#F0F0F0"),
            specular             = setColor("specular", NES, "#000000"),
            ambient              = setColor("ambient", NES, "#F0F0F0"),
            emissive             = setColor("emissive", NES, basicColor),
            fontSpec             = FONTS[fontFamily],
            letterScale          = round(scale*rawheight/naturalLetterHeight),
            thickness            = round(scale*rawThickness),
            letters              = NES(lttrs) ? lttrs : "" ,
            material             = makeMaterial(scene, letters, emissive, ambient, specular, diffuse, opac),
            meshesAndBoxes       = constructLetterPolygons(letters, fontSpec, 0, 0, 0, letterScale, thickness, material, meshOrigin),
            offsetX              = anchor==="right" ? (0-meshesAndBoxes.xWidth) : ( anchor==="center" ? (0-meshesAndBoxes.xWidth/2) : 0 ),
            meshes               = meshesAndBoxes[0],
            lettersBoxes         = meshesAndBoxes[1],
            combo                = makeSPS(scene, meshesAndBoxes, material),
            sps                  = combo[0],
            mesh                 = combo[1];

        mesh.position.x          = scale*x+offsetX;
        mesh.position.y          = scale*y;
        mesh.position.z          = scale*z;

        this.getSPS              = function()  {return sps};
        this.getMesh             = function()  {return mesh};
        this.getMaterial         = function()  {return material};
        this.getOffsetX          = function()  {return offsetX};
        this.getLettersBoxes     = function()  {return lettersBoxes};
        this.color               = function(c) {return NES(c)?color=c:color};
        this.alpha               = function(o) {return Amp(o)?opac=o:opac};
        this.clearall            = function()  {sps=null;mesh=null;material=null};

        function setOption(field, tst, defalt) { return tst(options[field]) ? options[field] : defalt };
        function setColor(field, tst, defalt)  { return tst(colors[field]) ? colors[field] : defalt };
        function setPositn(field, tst, defalt) { return tst(position[field]) ? position[field] : defalt }
      };

      proto                      = MeshWriter.prototype;

      proto.setColor             = function(color){
        var material             = this.getMaterial();
        if(NES(color)){
          material.emissiveColor = rgb2Bcolor3(this.color(color));
        }
      };
      proto.setAlpha             = function(alpha){
        var material             = this.getMaterial();
        if(Amp(alpha)){
          material.alpha         = this.alpha(alpha)
        }
      };
      proto.overrideAlpha        = function(alpha){
        var material             = this.getMaterial();
        if(Amp(alpha)){
          material.alpha         = alpha
        }
      };
      proto.resetAlpha           = function(){
        var material             = this.getMaterial();
        material.alpha           = this.alpha()
      };
      proto.getLetterCenter      = function(ix){
        return new BABYLON.Vector2(0,0)
      }
      proto.dispose              = function(){
        var mesh                 = this.getMesh(),
            sps                  = this.getSPS(),
            material             = this.getMaterial();
        if(sps){sps.dispose()}
        this.clearall()
      };
      MeshWriter.codeList        = codeList;

      return MeshWriter;

    };
    window.TYPE                  = Wrapper;
    if ( typeof BABYLON === "object" ) {
      BABYLON.MeshWriter = Wrapper;
      supplementCurveFunctions();
    };
    return Wrapper;

    function makeSPS(scene,meshesAndBoxes,material){
      var meshes                 = meshesAndBoxes[0],
          lettersOrigins         = meshesAndBoxes[2],sps,spsMesh;
      if(meshes.length){
        sps                      = new BABYLON.SolidParticleSystem("sps"+"test",scene, { } );
        meshes.forEach(function(mesh,ix){
          sps.addShape(mesh, 1, {positionFunction: makePositionParticle(lettersOrigins[ix])});
          mesh.dispose()
        });
        spsMesh                  = sps.buildMesh();
        spsMesh.material         = material;
        sps.setParticles()
      }
      return [sps,spsMesh];

      function makePositionParticle(letterOrigins){
        return function positionParticle(particle,ix,s){
          particle.position.x    = letterOrigins[0]+letterOrigins[1];
          particle.position.z    = letterOrigins[2]
        }
      }
    };

    function constructLetterPolygons(letters, fontSpec, xOffset, yOffset, zOffset, letterScale, thickness, material, meshOrigin){
      var letterOffsetX          = 0,
          lettersOrigins         = new Array(letters.length),
          lettersBoxes           = new Array(letters.length),
          lettersMeshes          = new Array(letters.length),
          ix                     = 0,letter,letterSpec,i,j,lists,shapesList,holesList,shape,holes,csgShape,letterMesh,letterMeshes,letterBoxes,letterOrigins,meshesAndBoxes;

      for(i=0;i<letters.length;i++){
        letter                   = letters[i];
        letterSpec               = makeLetterSpec(fontSpec,letter);
        if(NNO(letterSpec)){
          lists                  = buildLetterMeshes(letter, i, letterSpec, fontSpec.reverseShapes, fontSpec.reverseHoles);
          shapesList             = lists[0];
          holesList              = lists[1];
          letterMeshes           = [];
          for(j=0;j<shapesList.length;j++){
            shape                = shapesList[j];
            holes                = holesList[j];
            if(NEA(holes)){
              letterMesh         = punchHolesInShape(shape, holes, letter, i)
            }else{
              letterMesh         = shape
            }
            letterMeshes.push(letterMesh);
          }
          if(letterMeshes.length){
            lettersMeshes[ix]    = merge(letterMeshes);
            lettersOrigins[ix]   = letterOrigins;
            lettersBoxes[ix]     = letterBoxes;
            ix++
          }
        }
      };
      meshesAndBoxes             = [lettersMeshes,lettersBoxes,lettersOrigins];
      meshesAndBoxes.xWidth      = round(letterOffsetX);
      meshesAndBoxes.count       = ix;
      return meshesAndBoxes;

      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      // A letter may have one or more shapes and zero or more holes
      // The shapeCmds is an array of shapes
      // The holeCmds is an array of array of holes (since one shape 'B' may have multiple holes)
      // The arrays must line up so holes have the same index as the shape they subtract from
      // '%' is the best example since it has three shapes and two holes
      // 
      // For mystifying reasons, the holeCmds (provided by the font) must be reversed
      // from the original order and the shapeCmds must *not* be reversed
      // UNLESS the font is Jura, in which case the holeCmds are inverted from above instructions
      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

      function buildLetterMeshes(letter, index, spec, reverseShapes, reverseHoles){
        var balanced             = meshOrigin === "letterCenter",
            centerX              = (spec.xMin+spec.xMax)/2,
            centerZ              = (spec.yMin+spec.yMax)/2,
            offX                 = xOffset-(balanced?centerX:0),
            offZ                 = zOffset-(balanced?centerZ:0),
            shapeCmdsLists       = tyA(spec.shapeCmds) ? spec.shapeCmds : [],
            holeCmdsListsArray   = tyA(spec.holeCmds) ? spec.holeCmds : [];

        letterBoxes              = [ adjustX(spec.xMin), adjustX(spec.xMax), adjustZ(spec.yMin), adjustZ(spec.yMax) ];
        letterOrigins            = [ round(letterOffsetX), -1*adjustX(0), -1*adjustZ(0) ];
        letterOffsetX            = letterOffsetX+spec.width*letterScale;

        return [shapeCmdsLists.map(makeMeshFromCmdsList(reverseShapes)),holeCmdsListsArray.map(meshesFromCmdsListArray)];

        function meshesFromCmdsListArray(cmdsListArray){
          return cmdsListArray.map(makeMeshFromCmdsList(reverseHoles))
        };
        function makeMeshFromCmdsList(reverse){
          return function meshFromCmdsList(cmdsList){
            var path             = new BABYLON.Path2(adjustX(cmdsList[0][0]), adjustZ(cmdsList[0][1])), cmd, array, meshBuilder, mesh, j;

            for(j=1;j<cmdsList.length;j++){
              cmd                = cmdsList[j];
              if(cmd.length===2){ path.addLineTo(adjustX(cmd[0]), adjustZ(cmd[1])) }
              if(cmd.length===4){ path.addQuadraticCurveTo(adjustX(cmd[0]), adjustZ(cmd[1]), adjustX(cmd[2]), adjustZ(cmd[3])) }
              if(cmd.length===6){ path.addCubicCurveTo(adjustX(cmd[0]), adjustZ(cmd[1]), adjustX(cmd[2]), adjustZ(cmd[3]), adjustX(cmd[4]), adjustZ(cmd[5])) }
            }
            array                = path.getPoints().map(point2Vector);
            if(array[0].x===array[array.length-1].x&&array[0].y===array[array.length-1].y){array=array.slice(1)}
            if(reverse){array.reverse()}
            meshBuilder          = new BABYLON.PolygonMeshBuilder("MeshWriter-"+letter+index+"-"+weeid(), array, scene);
            mesh                 = meshBuilder.build(true,thickness);
            return mesh;
          }
        };
        function adjustX(xVal){return round(letterScale*(xVal+offX))};
        function adjustZ(zVal){return round(letterScale*(zVal+offZ))}
      };

      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      function punchHolesInShape(shape,holes,letter,i){
        var csgShape             = BABYLON.CSG.FromMesh(shape);
        for(var k=0; k<holes.length; k++){
          csgShape               = csgShape.subtract(BABYLON.CSG.FromMesh(holes[k]))
        }
        holes.forEach(function(h){h.dispose()});
        shape.dispose();
        return csgShape.toMesh("Net-"+letter+i+"-"+weeid())
      };
    };

    function makeMaterial(scene,letters,emissive,ambient,specular,diffuse,opac){
      var cm0                    = new BABYLON.StandardMaterial("meshwriter-material-"+letters+"-"+weeid(),scene);
      cm0.diffuseColor           = rgb2Bcolor3(diffuse);
      cm0.specularColor          = rgb2Bcolor3(specular);
      cm0.ambientColor           = rgb2Bcolor3(ambient);
      cm0.emissiveColor          = rgb2Bcolor3(emissive);
      cm0.alpha                  = opac;
      return cm0
    };

    function supplementCurveFunctions(){

      // Thanks Gijs, wherever you are
      BABYLON.Path2.prototype.addQuadraticCurveTo = function(redX, redY, blueX, blueY){
        var points               = this.getPoints();
        var lastPoint            = points[points.length - 1];
        var origin               = new BABYLON.Vector3(lastPoint.x, lastPoint.y, 0);
        var control              = new BABYLON.Vector3(redX, redY, 0);
        var destination          = new BABYLON.Vector3(blueX, blueY, 0);
        var nb_of_points         = curveSampleSize;
        var curve                = BABYLON.Curve3.CreateQuadraticBezier(origin, control, destination, nb_of_points);
        var curvePoints          = curve.getPoints();
        for(var i=1; i<curvePoints.length; i++){
          this.addLineTo(curvePoints[i].x, curvePoints[i].y);
        }
      };
      BABYLON.Path2.prototype.addCubicCurveTo = function(redX, redY, greenX, greenY, blueX, blueY){
        var points               = this.getPoints();
        var lastPoint            = points[points.length - 1];
        var origin               = new BABYLON.Vector3(lastPoint.x, lastPoint.y, 0);
        var control1             = new BABYLON.Vector3(redX, redY, 0);
        var control2             = new BABYLON.Vector3(greenX, greenY, 0);
        var destination          = new BABYLON.Vector3(blueX, blueY, 0);
        var nb_of_points         = Math.floor(0.3+curveSampleSize*1.5);
        var curve                = BABYLON.Curve3.CreateCubicBezier(origin, control1, control2, destination, nb_of_points);
        var curvePoints          = curve.getPoints();
        for(var i=1; i<curvePoints.length; i++){
          this.addLineTo(curvePoints[i].x, curvePoints[i].y);
        }
      }
    }

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    // Conversion functions
    function rgb2Bcolor3(rgb){
      rgb                        = rgb.replace("#","");
      return new BABYLON.Color3(convert(rgb.substring(0,2)),convert(rgb.substring(2,4)),convert(rgb.substring(4,6)));
      function convert(x){return Γ(1000*Math.max(0,Math.min((tyN(parseInt(x,16))?parseInt(x,16):0)/255,1)))/1000}
    };
    function point2Vector(point){
      return new BABYLON.Vector2(round(point.x),round(point.y))
    };
    function merge(arrayOfMeshes){
      return arrayOfMeshes.length===1 ? arrayOfMeshes[0] : BABYLON.Mesh.MergeMeshes(arrayOfMeshes, true)
    };
    function makePreferences(args){
      var prefs = {},p;
      if(NNO(p=args[1])){
        if(p["default-font"]){prefs.defaultFont=p["default-font"]}else{if(p.defaultFont){prefs.defaultFont=p.defaultFont}}
        if(p["mesh-origin"]){prefs.meshOrigin=p["mesh-origin"]}else{if(p.meshOrigin){prefs.meshOrigin=p.meshOrigin}}
        if(p.scale){prefs.scale=p.scale}
        return prefs
      }else{
        return { defaultFont: args[2] , scale: args[1] }
      }
    };
    function makeLetterSpec(fontSpec,letter){
      var letterSpec           = fontSpec[letter],shapeCmds=[];
      // function makeLetterSpec(letterSpec){var shapeCmds=[];
      if(NNO(letterSpec)){
        if(!tyA(letterSpec.shapeCmds)&&tyA(letterSpec.sC)){
          letterSpec.shapeCmds   = letterSpec.sC.map(function(cmds){return decodeList(cmds)})
          letterSpec.sC          = null;
        }
        if(!tyA(letterSpec.holeCmds)&&tyA(letterSpec.hC)){
          letterSpec.holeCmds    = letterSpec.hC.map(function(cmdslists){if(tyA(cmdslists)){return cmdslists.map(function(cmds){return decodeList(cmds)})}else{return cmdslists}});
          letterSpec.hC          = null;
        }
      }
      return letterSpec;

      function decodeList(str){
        var split = str.split(" "),
            list  = [];
        split.forEach(function(cmds){
          if(cmds.length===12){list.push(decode6(cmds))}
          if(cmds.length===8){list.push(decode4(cmds))}
          if(cmds.length===4){list.push(decode2(cmds))}
        });
        return list
      };
      function decode6(s){return [decode1(s.substring(0,2)),decode1(s.substring(2,4)),decode1(s.substring(4,6)),decode1(s.substring(6,8)),decode1(s.substring(8,10)),decode1(s.substring(10,12))]};
      function decode4(s){return [decode1(s.substring(0,2)),decode1(s.substring(2,4)),decode1(s.substring(4,6)),decode1(s.substring(6,8))]};
      function decode2(s){return [decode1(s.substring(0,2)),decode1(s.substring(2,4))]};
      function decode1(s){return (frB128(s)-4000)/2};
    };
    function codeList(list,_str,_xtra){
      _str = _xtra = "";
      if(tyA(list)){
        list.forEach(function(cmds){
          if(cmds.length===6){_str+=_xtra+code6(cmds);_xtra=" "}
          if(cmds.length===4){_str+=_xtra+code4(cmds);_xtra=" "}
          if(cmds.length===2){_str+=_xtra+code2(cmds);_xtra=" "}
        });
      }
      return _str
      function code6(a){return code1(a[0])+code1(a[1])+code1(a[2])+code1(a[3])+code1(a[4])+code1(a[5])};
      function code4(a){return code1(a[0])+code1(a[1])+code1(a[2])+code1(a[3])};
      function code2(a){return code1(a[0])+code1(a[1])};
      function code1(n){return toB128((n+n)+4000)};
    };

    function frB128(s){
      var result=0,i=-1,l=s.length-1;
      while(i++<l){result = result*128+b128back[s.charCodeAt(i)]}
      return result;
    };
    function toB128(i){
      var s = b128digits[(i%128)];
      i     = Γ(i/128);
      while (i>0) {
        s   = b128digits[(i%128)]+s;
        i   = Γ(i/128);
      }
      return s;
    };
    function prepArray(){
      var pntr                   = -1,n;
      while(160>pntr++){
        if(pntr<128){
          n                      = fr128to256(pntr);
          b128digits[pntr]       = String.fromCharCode(n);
          b128back[n]            = pntr
        }else{
          if(pntr===128){
            b128back[32]         = pntr
          }else{
            b128back[pntr+71]    = pntr
          }
        }
      };
      function fr128to256(n){if(n<92){return n<58?n<6?n+33:n+34:n+35}else{return n+69}}
    };

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    // Boolean test functions
    function PN(mn)   { return typeof mn === "number" && !isNaN(mn) ? 0 < mn : false } ;
    function tyN(mn)  { return typeof mn === "number" } ;
    function Amp(ma)  { return typeof ma === "number" && !isNaN(ma) ? 0 <= ma && ma <= 1 : false } ;
    function NNO(mo)  { return mo != null && typeof mo === "object" || typeof mo === "function" } ;
    function tyA(ma)  { return ma != null && typeof ma === "object" && ma.constructor === Array } ; 
    function NEA(ma)  { return ma != null && typeof ma === "object" && ma.constructor === Array && 0 < ma.length } ; 
    function NES(ms)  {if(typeof(ms)=="string"){return(ms.length>0)}else{return(false)}} ;
    function supportedFont(ff){ return NNO(FONTS[ff]) } ;
    function supportedAnchor(a){ return a==="left"||a==="right"||a==="center" } ;
    function weeid()  { return Math.floor(Math.random()*1000000) } ;
    function round(n) { return Γ(0.3+n*1000000)/1000000 }
  }
);