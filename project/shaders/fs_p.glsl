precision highp float; 

uniform vec4 mDiffColor;
uniform vec4 mSpecColor;            
uniform float mSpecPower;

uniform sampler2D textureFile;
uniform float ambientLightInfluence;
uniform vec4 ambientLightColor;

uniform vec3 lightPosition;
uniform vec4 lightColor;

uniform vec3 eyePosition;

varying vec3 fsNormal; 
varying vec3 fsPosition; 
varying vec2 fsUVs;
varying vec2 fsUV2s;

//variables for illuminating levers, keys and keyholes
uniform float fsLightUpObject;
uniform float lightUpPercentage;
/*varying bool leverIsReachable;
varying bool keyIsReachable;
varying bool goldenKeyholeIsReachable;
varying bool copperKeyholeIsReachable;
varying bool hasBeenPulled;
varying bool isCarryingGoldenKey;
varying bool isCarryingCopperKey;*/

//Function to create different lights types
//vec3 pos = the surface position

vec4 lightModel(vec3 pos) {
	
	//The normalize light direction
    vec3 nLightDir;
	//Float to store light dimension and cone length
	float lDim;

	//Point light (decay)
	float lLen = length(lightPosition - pos);
	nLightDir = normalize(lightPosition - pos);
	lDim = 15.0 / (lLen * lLen);

	return vec4(nLightDir, lDim);
}

void main() { 

	vec3 nEyeDirection = normalize(eyePosition - fsPosition);
	vec3 nNormal = normalize(fsNormal);
	
	vec4 lm = lightModel(fsPosition);
	vec3 nlightDirection = lm.rgb;
	float lightDimension = lm.a;
	
	//Computing the color contribution from the texture
	vec4 diffuseTextureColorMixture = texture2D(textureFile, fsUVs);

	//Computing the ambient light contribution
	//We assume that the ambient color of the object is identical to it diffuse color (including its texture contribution)
	vec4 ambLight;
	if(fsLightUpObject > 0.0)
	ambLight = ambientLightColor * lightUpPercentage;
		//ambLight = vec4(1.0,1.0,1.0,1.0);
	else
		ambLight = diffuseTextureColorMixture * ambientLightColor * ambientLightInfluence;

	vec4 diffuse = 0.1 * diffuseTextureColorMixture * lightColor * clamp(dot(nlightDirection, nNormal), 0.0, 1.0) * lightDimension;

	//Reflection vector for Phong model
	vec3 reflection = -reflect(nlightDirection, nNormal);
	vec4 specular =  mSpecColor * lightColor * pow(clamp(dot(reflection, nEyeDirection),0.0, 1.0), mSpecPower) * lightDimension;
	gl_FragColor = min(ambLight + diffuse + specular, vec4(1.0, 1.0, 1.0, 1.0));

}