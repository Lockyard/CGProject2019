function shaders() {
// The shader can find the required informations in the following variables:

//vec3 fs_pos;			// Position of the point in 3D space
//
//vec3 LAPos;			// Position of first (or single) light
//vec3 LADir;			// Direction of first (or single) light
//float LAConeOut;		// Outer cone (in degree) of the light (if spot)
//float LAConeIn;		// Inner cone (in percentage of the outher cone) of the light (if spot)
//float LADecay;		// Decay factor (0, 1 or 2)
//float LATarget;		// Target distance
//vec4 LAlightColor;	// color of the first light
//		
//vec3 LBPos;			// Same as above, but for the second light
//vec3 LBDir;
//float LBConeOut;
//float LBConeIn;
//float LBDecay;
//float LBTarget;
//vec4 LBlightColor;
//
//vec3 LCPos;			// Same as above, but for the third one
//vec3 LCDir;
//float LCConeOut;
//float LCConeIn;
//float LCDecay;
//float LCTarget;
//vec4 LClightColor;
//
//vec4 ambientLightColor;		// Ambient light color. For hemispheric, this is the color on the top
//vec4 ambientLightLowColor;	// For hemispheric ambient, this is the bottom color
//vec3 ADir;					// For hemispheric ambient, this is the up direction
//
//float SpecShine;				// specular coefficient for both blinn and phong
//float DToonTh;				// Threshold for diffuse in a toon shader
//float SToonTh;				// Threshold for specular in a toon shader
//
//vec4 diffColor;				// diffuse color
//vec4 ambColor;				// material ambient color
//vec4 specularColor;			// specular color
//vec4 emit;					// emitted color
//	
//vec3 normalVec;				// direction of the normal vecotr to the surface
//vec3 eyedirVec;				// looking direction
//
//
// Final color is returned into:
//vec4 out_color;

// Single directional light, Lambert diffuse only: no specular, no ambient, no emission
var S1 = `
	out_color = LAlightColor * diffColor * clamp(dot(LADir,normalVec),0.0,1.0);
`;

// Single point light with decay, Lambert diffuse, Blinn specular, no ambient and no emission
var S2 = `
    vec3 pointlight_dir = normalize(LADir + eyedirVec);
    vec4 decay_factor = LAlightColor * pow(LATarget/length(LAPos - fs_pos),LADecay);
    
    vec3 h = normalize(LADir + eyedirVec);

	vec4 out_color_noclamp = decay_factor * LAlightColor *  diffColor * clamp(dot(pointlight_dir,normalVec),0.0,1.0) + 
                            LAlightColor * specularColor * pow(clamp(dot(normalVec, h), 0.0, 1.0), SpecShine);

    out_color = clamp(out_color_noclamp, 0.0, 1.0);
`;

// Single directional light, Lambert diffuse, Phong specular, constant ambient and emission
var S3 = `
    vec3 r = -reflect(LADir, normalVec);

    vec4 ambient = ambColor * ambientLightColor;

	vec4 out_color_noclamp = LAlightColor * diffColor * clamp(dot(LADir,normalVec),0.0,1.0) + specularColor * LAlightColor * pow(clamp(dot(eyedirVec, r), 0.0, 1.0),SpecShine) + ambient + emit;

    out_color = clamp(out_color_noclamp, 0.0, 1.0);
`;

// Single spot light (with decay), Lambert diffuse, Blinn specular, no ambient and no emission
var S4 = `
	out_color = vec4(0.0, 0.0, 1.0, 1.0);
`;

// Single directional light, Cartoon diffuse, Cartoon specular, no ambient but emission
var S5 = `
	out_color = vec4(1.0, 0.0, 1.0, 1.0);
`;

// Single directional light, no diffuse, phong specular, hemispheric ambient and no emission
var S6 = `
	out_color = vec4(0.0, 1.0, 1.0, 1.0);
`;

// Three lights: a directional, a point and a spot. Lambert diffuse, phong specular, constant ambient and no emission
var S7 = `
	out_color = vec4(1.0, 1.0, 1.0, 1.0);
`;
    
	return [S1, S2, S3, S4, S5, S6, S7];
}

