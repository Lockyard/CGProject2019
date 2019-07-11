#version 300 es
precision highp float;

uniform vec4 mDiffColor;
uniform vec4 mSpecColor;            
uniform float mSpecPower;

uniform sampler2D textureFile;
uniform float ambientLightInfluence;
uniform vec4 ambientLightColor;

uniform vec3 lightDirection;
uniform vec3 lightPosition;
uniform vec4 lightColor;
uniform int lightType;

uniform vec3 eyePosition;

in vec3 fsNormal;
in vec3 fsPosition;
in vec2 fsUVs;
in vec2 fsUV2s;
out vec4 outColor;

//variables for illuminating levers, keys and keyholes
uniform float fsLightUpObject;
uniform float lightUpPercentage;

//Function to create different lights types
//vec3 pos = the surface position
vec4 lightModel(int lt, vec3 pos) {
	
	//The normalize light direction
    vec3 nLightDir;
	//Float to store light dimension and cone length
	float lDim, lCone;

	lDim = 1.0;

	if(lt == 1){						//Point light (decay)
		float lLen = length(lightPosition - pos);
		nLightDir = normalize(lightPosition - pos);
		lDim = 15.0 / (lLen * lLen);
	} else if(lt == 2) {				//Spot light
		float cOut = 0.85;
		float cIn = 0.99;
		nLightDir = normalize(lightPosition - pos);
		lCone = -dot(nLightDir, normalize(lightDirection));
		if(lCone < cOut) {
			lDim = 0.0;
		} else if(lCone > cIn) {
			lDim = 1.0;
		} else {
			lDim = (lCone - cOut) / (cIn - cOut);
		}
	}

	return vec4(nLightDir, lDim);
}

void main() { 

	vec3 nEyeDirection = normalize(eyePosition - fsPosition);
	vec3 nNormal = normalize(fsNormal);
	
	vec4 lm = lightModel(lightType, fsPosition);
	vec3 nlightDirection = lm.rgb;
	float lightDimension = lm.a;
	
	//Computing the color contribution from the texture or from the diffuse color (for levers)
	vec4 diffuseTextureColorMixture = vec4(0.0, 0.0, 0.0, 0.0);
	//if(fsUVs != vec2(0.0, 0.0))
		diffuseTextureColorMixture = texture(textureFile, fsUVs);
	//else
	//	diffuseTextureColorMixture = mDiffColor;
	//Computing the ambient light contribution
	//We assume that the ambient color of the object is identical to it diffuse color (including its texture contribution)
	vec4 ambLight;
	if(fsLightUpObject > 0.0)		ambLight = ambientLightColor * lightUpPercentage;
	else 							ambLight = diffuseTextureColorMixture * ambientLightColor * ambientLightInfluence;

	if(lightType == 0){
		outColor = diffuseTextureColorMixture;
	}else {
		float diffuseIntensity = 0.4;
		if(lightType == 1) diffuseIntensity = 0.1;
		vec4 diffuse = diffuseIntensity * diffuseTextureColorMixture * lightColor * clamp(dot(nlightDirection, nNormal), 0.0, 1.0) * lightDimension;

		//Reflection vector for Phong model
		vec3 reflection = -reflect(nlightDirection, nNormal);
		vec4 specular =  mSpecColor * lightColor * pow(clamp(dot(reflection, nEyeDirection), 0.0, 1.0), mSpecPower) * lightDimension;
		outColor = min(ambLight + diffuse + specular, diffuseTextureColorMixture + vec4(0.7, 0.7, 0.7, 0.1));
		//vec4(1.0, 1.0, 1.0, 1.0));
	}
}