/*
* BALDASSERONI - CARNAGHI
* Computer Graphics 2019 course
* Politecnico di Milano
*/

var canvas;
var gl = null;

var	shaderProgram;

var shaderDir = "http://127.0.0.1:8887/shaders/";
var modelsDir = "http://127.0.0.1:8887/assets/";

var perspectiveMatrix,
    viewMatrix;

var vertexNormalHandle;
var vertexPositionHandle;
var vertexUVHandle;
var textureFileHandle;
var ambientLightInfluenceHandle;
var ambientLightColorHandle;

var matrixPositionHandle;
var worldMatrixHandle;
var	materialDiffColorHandle;
//player's light params
var lightPositionHandle;
var lightColorHandle;
var lightDirectionHandle;
var lightTypeHandle;
var lightConeInHandle;
var lightConeOutHandle;
var lightDecayHandle;
var lightTargetHandle;
//torches light params (point lights)
var torchlightPositionHandle;
var torchlightColorHandle;
var torchlightDecayHandle;
var torchlightTargetHandle;

var	eyePositionHandle;
var eyeDirectionHandle
var materialSpecColorHandle;
var materialSpecPowerHandle;
var materialEmitColorHandle;
var objectSpecularPower = 20.0;

var sceneObjects; //total number of nodes
// The following arrays have sceneObjects as dimension.
var vertexBufferObjectId= new Array();
var indexBufferObjectId = new Array();
var objectWorldMatrix = new Array();
var projectionMatrix= new Array();
var facesNumber		= new Array();
var diffuseColor 	= new Array();	//diffuse material colors of objs
var specularColor   = new Array();
var emitColor       = new Array();
var diffuseTextureObj 	= new Array();	//Texture material
var nTexture 		= new Array();	//Number of textures per object


// Eye parameters
var observerPositionObj = new Array();
var observerDirectionObj = new Array();
var lightDirectionObj = new Array();
// Ambient light parameters
var ambientLightInfluence = 0.1;
var ambientLightColor = [1.0, 1.0, 1.0, 1.0];
// Lantern - user's light - parameters
//var currentLightType = 1; //initialized in illumination
var lightPositionObj = new Array();
var lightColor = new Float32Array([1.0, 1.0, 1.0, 1.0]);

//Parameters for light definition (directional light)
var lightDirection = [];
var observerDirection = [];

//Constants for finding specific objects
var lightUpObjectHandle;
var lightUpPercentageHandle;

//time vars, used to calculate delta
var t = 1, prevT = 1;
const MIN_DELTA = 0.05      //1/20. the minimum delta of the game (20 fps)
var delta = 1.0;


function main(){

    canvas=document.getElementById("c");

    try{
        //get Canvas without aplpha channel
        gl = canvas.getContext("webgl2", {alpha: false});
    }catch(e){
        console.log(e);
    }
    if(gl){

        //Setting the size for the canvas equal to half the browser window
        //and other useful parameters
        var w=canvas.clientWidth;
        var h=canvas.clientHeight;
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.viewport(0.0, 0.0, w, h);
        gl.enable(gl.DEPTH_TEST);
        perspectiveMatrix = utils.MakePerspective(45, w/h, 0.1, 100.0);

        //Open the json file containing the 3D model to load,
        //parse it to retreive objects' data
        //and creates the VBO and IBO from them
        //The vertex format is (x,y,z,nx,ny,nz,u,v)
        loadModel("Dungeon.diff3new.json");

        //Load shaders' code
        //compile them
        //retrieve the handles
        loadShaders();

        //Setting up the interaction using keys
        initInteraction();

        //Rendering cycle
        drawScene();


    }else{
        alert( "Error: Your browser does not appear to support WebGL.");
    }

}


function loadShaders(){

    utils.loadFiles([ shaderDir + 'vs_ex.glsl', shaderDir + 'fs_ex.glsl' ],
        function(shaderText){
                    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                    gl.shaderSource(vertexShader, shaderText[0]);
                    gl.compileShader(vertexShader);
                    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
                        alert("ERROR IN VS SHADER : "+gl.getShaderInfoLog(vertexShader));
                    }
                    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(fragmentShader, shaderText[1]);
                    gl.compileShader(fragmentShader);
                    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
                        alert("ERROR IN FS SHADER : "+gl.getShaderInfoLog(fragmentShader));
                    }
                    shaderProgram = gl.createProgram();
                    gl.attachShader(shaderProgram, vertexShader);
                    gl.attachShader(shaderProgram, fragmentShader);
                    gl.linkProgram(shaderProgram);
                    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
                        alert("Unable to initialize the shader program...");}
            });

    //*** Getting the handles to the shader's vars
        vertexPositionHandle = gl.getAttribLocation(shaderProgram, 'inPosition');
        vertexNormalHandle = gl.getAttribLocation(shaderProgram, 'inNormal');
        vertexUVHandle = gl.getAttribLocation(shaderProgram, 'inUVs');

        matrixPositionHandle = gl.getUniformLocation(shaderProgram, 'wvpMatrix');
        worldMatrixHandle = gl.getUniformLocation(shaderProgram, 'worldMatrix');

        materialDiffColorHandle = gl.getUniformLocation(shaderProgram, 'mDiffColor');
        materialSpecColorHandle = gl.getUniformLocation(shaderProgram, 'mSpecColor');
        materialSpecPowerHandle = gl.getUniformLocation(shaderProgram, 'mSpecPower');
        materialEmitColorHandle = gl.getUniformLocation(shaderProgram, 'mEmitColor');
        textureFileHandle = gl.getUniformLocation(shaderProgram, 'textureFile');

        ambientLightInfluenceHandle = gl.getUniformLocation(shaderProgram, 'ambientLightInfluence');
        ambientLightColorHandle= gl.getUniformLocation(shaderProgram, 'ambientLightColor');

        eyePositionHandle = gl.getUniformLocation(shaderProgram, 'eyePosition');
        eyeDirectionHandle = gl.getUniformLocation(shaderProgram, 'eyeDirection');

        lightPositionHandle = gl.getUniformLocation(shaderProgram, 'lightPosition');
        lightColorHandle = gl.getUniformLocation(shaderProgram, 'lightColor');
        lightDirectionHandle = gl.getUniformLocation(shaderProgram, 'lightDirection');
        lightTypeHandle = gl.getUniformLocation(shaderProgram,'lightType');
        lightConeInHandle = gl.getUniformLocation(shaderProgram,'lightConeIn');
        lightConeOutHandle = gl.getUniformLocation(shaderProgram,'lightConeOut');
        lightDecayHandle = gl.getUniformLocation(shaderProgram, 'lightDecay');
        lightTargetHandle = gl.getUniformLocation(shaderProgram, 'lightTarget');

        //torch handlers
        torchlightPositionHandle    = gl.getUniformLocation(shaderProgram, 'torchlightPosition');
        torchlightColorHandle       = gl.getUniformLocation(shaderProgram, 'torchlightColor');
        torchlightDecayHandle       = gl.getUniformLocation(shaderProgram, 'torchlightDecay');
        torchlightTargetHandle      = gl.getUniformLocation(shaderProgram, 'torchlightTarget');

        //lightUpObjectHandle = gl.getAttribLocation(shaderProgram, 'inLightUpObject');
        lightUpObjectHandle = gl.getUniformLocation(shaderProgram, 'fsLightUpObject');
        lightUpPercentageHandle = gl.getUniformLocation(shaderProgram, 'lightUpPercentage');

}


function loadModel(modelName){

    utils.get_json(modelsDir + modelName, function(loadedModel){

        sceneObjects = loadedModel.meshes.length ;

        console.log("Found " + sceneObjects + " objects...");
        //from model, load parameters for logic, illumination and scenegraph, separately
        loadElementsFromModel(loadedModel)
        loadIlluminationParamsFromModel(loadedModel)
        loadSceneGraphFromModel(loadedModel)

        //preparing to store objects' world matrix & the lights & material properties per object
        for (i=0; i < sceneObjects; i++) {
            objectWorldMatrix[i] = new utils.identityMatrix();
            projectionMatrix[i] =  new utils.identityMatrix();
            diffuseColor[i] = [1.0, 1.0, 1.0, 1.0];
            emitColor[i] =  [0.0, 0.0, 0.0, 1.0];
            specularColor[i] = [1.0, 1.0, 1.0, 1.0];
            observerPositionObj[i] = new Array(3);
            observerDirectionObj[i] = new Array(3);
            lightDirectionObj[i] = new Array(3);
            lightPositionObj[i]	= new Array(3);
        }

        for (i=0; i < sceneObjects ; i++) {

            //Creating the vertex data.
            console.log("Object["+i+"]:");
            console.log("MeshName: "+ loadedModel.rootnode.children[i].name);
            console.log("Vertices: "+ loadedModel.meshes[i].vertices.length);
            console.log("Normals: "+ loadedModel.meshes[i].normals.length);
            if (loadedModel.meshes[i].texturecoords){
                console.log("UVss: " + loadedModel.meshes[i].texturecoords[0].length);
            } else {
                console.log("No UVs for this mesh!" );
            }

            var meshMatIndex = loadedModel.meshes[i].materialindex;

            var UVFileNamePropertyIndex = -1;
            var diffuseColorPropertyIndex = -1;
            var specularColorPropertyIndex = -1;
            var emitColorPropertyIndex = -1;
            for (n = 0; n < loadedModel.materials[meshMatIndex].properties.length; n++){
                if(loadedModel.materials[meshMatIndex].properties[n].key == "$tex.file") UVFileNamePropertyIndex = n;
                if(loadedModel.materials[meshMatIndex].properties[n].key == "$clr.diffuse") diffuseColorPropertyIndex = n;
                if(loadedModel.materials[meshMatIndex].properties[n].key == "$clr.specular") specularColorPropertyIndex = n;
                if(loadedModel.materials[meshMatIndex].properties[n].key == "$clr.emissive") emitColorPropertyIndex = n;
            }


            //*** Getting vertex and normals
            var objVertex = [];
            for (n = 0; n < loadedModel.meshes[i].vertices.length/3; n++){
                objVertex.push(loadedModel.meshes[i].vertices[n*3],
                    loadedModel.meshes[i].vertices[n*3+1],
                    loadedModel.meshes[i].vertices[n*3+2]);
                objVertex.push(loadedModel.meshes[i].normals[n*3],
                    loadedModel.meshes[i].normals[n*3+1],
                    loadedModel.meshes[i].normals[n*3+2]);
                if(UVFileNamePropertyIndex>=0){
                    objVertex.push( loadedModel.meshes[i].texturecoords[0][n*2],
                        loadedModel.meshes[i].texturecoords[0][n*2+1]);

                } else {
                    objVertex.push( 0.0, 0.0);
                }
            }

            facesNumber[i] = loadedModel.meshes[i].faces.length;
            console.log("Face Number: "+facesNumber[i]);



            s=0;

            if(UVFileNamePropertyIndex>=0){

                nTexture[i]=true;

                console.log(loadedModel.materials[meshMatIndex].properties[UVFileNamePropertyIndex].value);
                var imageName = loadedModel.materials[meshMatIndex].properties[UVFileNamePropertyIndex].value;

                var getTexture = function(image_URL){


                    var image=new Image();
                    image.webglTexture=false;
                    requestCORSIfNotSameOrigin(image, image_URL);

                    image.onload=function(e) {

                        var texture=gl.createTexture();

                        gl.bindTexture(gl.TEXTURE_2D, texture);

                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.generateMipmap(gl.TEXTURE_2D);

                        gl.bindTexture(gl.TEXTURE_2D, null);
                        image.webglTexture=texture;
                    };

                    image.src=image_URL;

                    return image;
                };

                diffuseTextureObj[i] = getTexture(modelsDir + imageName);

                console.log("TXT filename: " +diffuseTextureObj[i]);
                console.log("TXT src: " +diffuseTextureObj[i].src);
                console.log("TXT loaded?: " +diffuseTextureObj[i].webglTexture);

            } else {
                nTexture[i] = false;
            }

            //*** mesh color
            diffuseColor[i] = loadedModel.materials[meshMatIndex].properties[diffuseColorPropertyIndex].value; // diffuse value

            diffuseColor[i].push(1.0);													// Alpha value added

            emitColor[i] = loadedModel.materials[meshMatIndex].properties[emitColorPropertyIndex].value;
            // Alpha value added if not already in
            if(emitColor[i][3] === undefined)                                           
                emitColor[i].push(1.0)
            console.log("Emit: "+ emitColor[i]);

            specularColor[i] = loadedModel.materials[meshMatIndex].properties[specularColorPropertyIndex].value;
            // Alpha value added if not already in
            if(specularColor[i][3] === undefined)
                specularColor[i].push(1.0)
            console.log("Specular: "+ specularColor[i]);

            //vertices, normals and UV set 1
            vertexBufferObjectId[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectId[i]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objVertex), gl.STATIC_DRAW);


            //Creating index buffer
            facesData = [];
            for (n = 0; n < loadedModel.meshes[i].faces.length; n++){

                facesData.push( loadedModel.meshes[i].faces[n][0],
                    loadedModel.meshes[i].faces[n][1],
                    loadedModel.meshes[i].faces[n][2]
                );
            }



            indexBufferObjectId[i]=gl.createBuffer ();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObjectId[i]);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(facesData),gl.STATIC_DRAW);


            //creating the objects' world matrix
            objectWorldMatrix[i] = loadedModel.rootnode.children[i].transformation;
            console.log("World Matrix:"+objectWorldMatrix[i])

            //Correcting the orientation of dungeon
            objectWorldMatrix[i] = utils.multiplyMatrices(
                objectWorldMatrix[i],
                utils.MakeRotateXMatrix(0));
            objectWorldMatrix[i] = utils.multiplyMatrices(
                objectWorldMatrix[i],
                utils.MakeRotateYMatrix(0));


        }


    });


}



function computeMatrices(){
    viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);

    var eyeTemp = [cx, cy, cz];
    var lanternPos = [cx, cy, cz];
    var radAngle = utils.degToRad(angle);
    var radElev = utils.degToRad(elevation);
    //light direction, 3 components of the direction, normalized
    lightDirection = [-Math.sin(radAngle)*Math.cos(radElev), -Math.sin(radElev), Math.cos(radAngle)*Math.cos(radElev)];
    //in our case the observer direction is the same as the fp light
    observerDirection = lightDirection;

    for(i=0; i < sceneObjects; i++){
        projectionMatrix[i] = utils.multiplyMatrices(viewMatrix, nodes[i].worldMatrix);
        projectionMatrix[i] = utils.multiplyMatrices(perspectiveMatrix, projectionMatrix[i]);

        lightDirectionObj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(nodes[i].worldMatrix)), lightDirection);

        lightPositionObj[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(nodes[i].worldMatrix)),lanternPos);

        observerPositionObj[i] = utils.multiplyMatrix3Vector3(utils.invertMatrix3(utils.sub3x3from4x4(nodes[i].worldMatrix)), eyeTemp);

        observerDirectionObj[i] = utils.multiplyMatrix3Vector3(utils.transposeMatrix3(utils.sub3x3from4x4(nodes[i].worldMatrix)), observerDirection);
    }

}


function drawScene(){
    updateDelta()
    updateInput(delta)
    updateAnimations()
    updateSceneGraph()

    computeMatrices()


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    for(i=0; i < sceneObjects; i++){

        gl.uniformMatrix4fv(matrixPositionHandle, gl.FALSE, utils.transposeMatrix(projectionMatrix[i]));

        gl.uniformMatrix4fv(worldMatrixHandle, gl.FALSE, utils.transposeMatrix(nodes[i].worldMatrix));

        gl.uniform1f(ambientLightInfluenceHandle, ambientLightInfluence);

        gl.uniform1i(textureFileHandle, 0);		//Texture channel 0 used for diff txt
        if (nTexture[i]==true && diffuseTextureObj[i].webglTexture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, diffuseTextureObj[i].webglTexture);
        }

        gl.uniform4f(lightColorHandle, lightColor[0],
            lightColor[1],
            lightColor[2],
            lightColor[3]);
        gl.uniform4f(materialDiffColorHandle, diffuseColor[i][0],
            diffuseColor[i][1],
            diffuseColor[i][2],
            diffuseColor[i][3]);
        
        gl.uniform4f(materialEmitColorHandle, emitColor[i][0],
            emitColor[i][1],
            emitColor[i][2],
            emitColor[i][3]);

        gl.uniform4f(materialSpecColorHandle, specularColor[i][0],
            specularColor[i][1],
            specularColor[i][2],
            specularColor[i][3]);

        gl.uniform4f(ambientLightColorHandle, ambientLightColor[0],
            ambientLightColor[1],
            ambientLightColor[2],
            ambientLightColor[3]);

        gl.uniform1f(materialSpecPowerHandle, objectSpecularPower);

        gl.uniform1i(lightTypeHandle, currentLightType);

        gl.uniform3f(lightPositionHandle, lightPositionObj[i][0],
            lightPositionObj[i][1],
            lightPositionObj[i][2]);
        

        gl.uniform3f(lightDirectionHandle, lightDirectionObj[i][0],
            lightDirectionObj[i][1],
            lightDirectionObj[i][2]);
        
        gl.uniform1f(lightConeInHandle, lightConeIn);
        gl.uniform1f(lightConeOutHandle, lightConeOut);

        gl.uniform1f(lightDecayHandle, lightDecay);
        gl.uniform1f(lightTargetHandle, lightTarget);

        //torch uniforms
        gl.uniform3fv(torchlightPositionHandle, torchlightsPositions);

        gl.uniform4f(torchlightColorHandle, torchlightColor[0],
            torchlightColor[1],
            torchlightColor[2],
            torchlightColor[3]);

        gl.uniform1f(torchlightDecayHandle, torchlightDecay);
        gl.uniform1f(torchlightTargetHandle, torchlightTarget);


        gl.uniform3f(eyePositionHandle,	observerPositionObj[i][0],
            observerPositionObj[i][1],
            observerPositionObj[i][2]);

        gl.uniform3f(eyeDirectionHandle,	observerDirectionObj[i][0],
            observerDirectionObj[i][1],
            observerDirectionObj[i][2]);

        illuminateReachableObjects(i); //illumination.js

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectId[i]);

        gl.enableVertexAttribArray(vertexPositionHandle);
        gl.vertexAttribPointer(vertexPositionHandle, 3, gl.FLOAT, gl.FALSE, 4 * 8, 0);

        gl.enableVertexAttribArray(vertexNormalHandle);
        gl.vertexAttribPointer(vertexNormalHandle, 3, gl.FLOAT, gl.FALSE, 4 * 8, 4 * 3);

        gl.vertexAttribPointer(vertexUVHandle, 2, gl.FLOAT, gl.FALSE, 4*8, 4*6);
        gl.enableVertexAttribArray(vertexUVHandle);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObjectId[i]);
        gl.drawElements(gl.TRIANGLES, facesNumber[i] * 3, gl.UNSIGNED_SHORT, 0);

        gl.disableVertexAttribArray(vertexPositionHandle);
        gl.disableVertexAttribArray(vertexNormalHandle);
    }

    window.requestAnimationFrame(drawScene);
}



function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
        img.crossOrigin = "";
    }
}

function updateLightType(val){
    currentLightType = parseInt(val);
}

/**
 * update delta time since last call of this method.
 * Delta is capped to the MIN_DELTA constant
 */
function updateDelta() {
    t = Date.now()/1000.0
    delta = Math.min(t - prevT, MIN_DELTA)
    prevT = t
}