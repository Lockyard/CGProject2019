#version 300 es
precision mediump float;

const float PI = 3.14159265358979;
//distance above which the light from a torch must not be calculated, for performance
const float TORCH_CALC_DISTANCE_THRESHOLD = 6.0;

uniform vec4 mDiffColor;
uniform vec4 mSpecColor;            
uniform float mSpecPower;
uniform vec4 mEmitColor;

uniform sampler2D textureFile;
uniform float ambientLightInfluence;
uniform vec4 ambientLightColor;

//color, direction, pos of main character light
uniform vec3 lightDirection;
uniform vec3 lightPosition;
uniform vec4 lightColor;
uniform int lightType;

uniform float lightConeOut;
uniform float lightConeIn;
uniform float lightDecay;
uniform float lightTarget;

//same parameters for every other light
uniform vec3 torchlightPosition[13];
uniform vec4 torchlightColor;
uniform float torchlightDecay;
uniform float torchlightTarget;

uniform vec3 eyePosition;
uniform vec3 eyeDirection;

in vec3 fsNormal;
in vec3 fsPosition;
in vec2 fsUVs;
in vec2 fsUV2s;
out vec4 outColor;

//variables for illuminating levers, keys and keyholes
uniform float fsLightUpObject;
uniform float lightUpPercentage;

//get the color value with a percentage of their intensity to be used, wrt white
vec4 partialColor(vec4 color, float percentage) {
	float invPerc = 1.0 - percentage;
	return color*percentage + vec4(invPerc, invPerc, invPerc, invPerc);
}

vec4 torchlightContribution(int i, vec4 textColor) {
	vec3 lx = normalize(torchlightPosition[i] - fsPosition);
	float decay = pow((torchlightTarget / length(torchlightPosition[i] - fsPosition)), torchlightDecay);
	vec4 pointLight = torchlightColor * decay;
	vec4 lambertDiff = partialColor(textColor, 0.3)* mDiffColor * clamp( dot(lx, fsNormal),0.0,1.0);
    vec4 blinnSpec = mSpecColor * pow(clamp(dot(fsNormal, normalize(lx + eyeDirection)), 0.0, 1.0), mSpecPower);
	return clamp(pointLight*(lambertDiff + blinnSpec), 0.0, 1.0);
}

void main() { 
    
    //Computing the color contribution from the texture or from the diffuse color (for levers)
	vec4 diffuseTextureColorMixture = texture(textureFile, fsUVs);

	vec3 lx = normalize(lightPosition - fsPosition);

	vec4 lambertDiff = diffuseTextureColorMixture * mDiffColor * clamp( dot(lx, fsNormal),0.0,1.0);
    vec4 blinnSpec = mSpecColor * pow(clamp(dot(fsNormal, normalize(lx + eyeDirection)), 0.0, 1.0), mSpecPower);

	vec4 ambient = partialColor(diffuseTextureColorMixture, 0.5) * ambientLightColor * ambientLightInfluence;

	vec4 lightUp;
	if(fsLightUpObject > 0.0) {
		lightUp = ambientLightColor * lightUpPercentage;
	}
	else {
		lightUp = vec4(0.0, 0.0, 0.0, 0.0);
	}

	vec4 emit = mEmitColor*diffuseTextureColorMixture;

	float decay = pow((lightTarget / length(lightPosition - fsPosition)), lightDecay);
	vec4 light;
	if(lightType == 1){						//Point light (decay)
		float lLen = length(lightPosition - fsPosition);
		float lDim = 15.0 / (lLen * lLen);
		light = lightColor * decay;
	} else if(lightType == 2) {				//Spot light
		float Cout  = cos(lightConeOut*PI/360.0);
		float Cin   = cos((lightConeOut*PI/360.0) * lightConeIn);

		light = lightColor * decay * clamp( (dot(lx, lightDirection) - Cout) / (Cin - Cout), 0.0, 1.0);
	}

	vec4 mainColor = light * (lambertDiff + blinnSpec) + ambient + emit +lightUp;

	for(int i=0;i< 13; i++) {
		if(length(torchlightPosition[i] - fsPosition) < TORCH_CALC_DISTANCE_THRESHOLD) {
			mainColor += torchlightContribution(i, diffuseTextureColorMixture);
		}
	}

	outColor = mainColor;

	
}

/**
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
*/