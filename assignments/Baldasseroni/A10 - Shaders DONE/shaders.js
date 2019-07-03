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
    vec3 pointlight_dir = normalize(LAPos - fs_pos);
    vec4 pointlight_color = LAlightColor;

    vec4 decay_factor = LAlightColor * pow(LATarget/length(LAPos - fs_pos),LADecay);

    vec4 lambert_diff = diffColor * clamp(dot(pointlight_dir,normalVec),0.0,1.0);
    
    vec3 half_vector = normalize(pointlight_dir + eyedirVec);
    vec4 blinn_spec = specularColor * pow(clamp(dot(normalVec, half_vector), 0.0, 1.0), SpecShine);

	vec4 out_color_noclamp = decay_factor * pointlight_color * ( lambert_diff + blinn_spec );

    out_color = clamp(out_color_noclamp, 0.0, 1.0);
`;

// Single directional light, Lambert diffuse, Phong specular, constant ambient and emission
var S3 = `
    vec4 directlight_color = LAlightColor;
    vec3 directlight_dir = LADir;

    vec4 lambert_diff = diffColor * clamp(dot(LADir,normalVec),0.0,1.0);

    vec3 r = -reflect(directlight_dir, normalVec);
    vec4 phong_spec = specularColor * pow(clamp(dot(eyedirVec, r), 0.0, 1.0),SpecShine);

    vec4 ambient = ambColor * ambientLightColor;

	vec4 out_color_noclamp = directlight_color * ( lambert_diff + phong_spec ) + ambient + emit;

    out_color = clamp(out_color_noclamp, 0.0, 1.0);
`;

// Single spot light (with decay), Lambert diffuse, Blinn specular, no ambient and no emission
var S4 = `
    vec3 spotlight_dir = normalize(LAPos - fs_pos);
    vec4 decay_factor = LAlightColor * pow(LATarget/length(LAPos - fs_pos),LADecay);
    float cout = cos(radians(LAConeOut)/2.0);
    float cin = cos((LAConeIn * radians(LAConeOut))/2.0);
    float cone_factor = clamp((dot(spotlight_dir, LADir) - cout)/(cin - cout), 0.0, 1.0);
    vec4 spotlight_color = decay_factor * cone_factor;

    vec4 lambert_diff = diffColor * clamp(dot(LADir,normalVec),0.0,1.0);

    vec3 half_vector = normalize(spotlight_dir + eyedirVec);
    vec4 blinn_spec = specularColor * pow(clamp(dot(normalVec, half_vector), 0.0, 1.0), SpecShine);

    vec4 out_color_noclamp = spotlight_color * ( lambert_diff + blinn_spec );

	out_color = clamp(out_color_noclamp, 0.0, 1.0);
`;

// Single directional light, Cartoon diffuse, Cartoon specular, no ambient but emission
//float DToonTh;				// Threshold for diffuse in a toon shader
//float SToonTh;				// Threshold for specular in a toon shader
var S5 = `
    vec4 directlight_color = LAlightColor;
    vec3 directlight_dir = LADir;

    vec4 toon_diff = vec4(0.0, 0.0, 0.0, 0.0);
    if(dot(directlight_dir, normalVec) >= DToonTh)
        toon_diff = diffColor;

    vec3 r = -reflect(directlight_dir, normalVec);
    vec4 toon_spec = vec4(0.0, 0.0, 0.0, 0.0);
    if(dot(eyedirVec, r) >= SToonTh)
        toon_spec = specularColor;

	vec4 out_color_noclamp = directlight_color * ( toon_diff + toon_spec ) + emit;

	out_color = clamp(out_color_noclamp, 0.0, 1.0);
`;

// Single directional light, no diffuse, Phong specular, hemispheric ambient and no emission
//vec4 ambientLightColor;		// Ambient light color. For hemispheric, this is the color on the top
//vec4 ambientLightLowColor;	// For hemispheric ambient, this is the bottom color
//vec3 ADir;					// For hemispheric ambient, this is the up direction
var S6 = `
    vec4 directlight_color = LAlightColor;
    vec3 directlight_dir = LADir;

    vec3 r = -reflect(directlight_dir, normalVec);
    vec4 phong_spec = specularColor * pow(clamp(dot(eyedirVec, r), 0.0, 1.0),SpecShine);

    float upper_component = (1.0 + dot(normalVec, ADir))/2.0;
    float lower_component = (1.0 - dot(normalVec, ADir))/2.0;
    vec4 ambHemispheric =  upper_component * ambientLightColor + lower_component * ambientLightLowColor;
    vec4 ambient = ambHemispheric * ambColor;

	vec4 out_color_noclamp = directlight_color * phong_spec + ambient;

	out_color = clamp(out_color_noclamp, 0.0, 1.0);
`;

// Three lights: a directional, a point and a spot. Lambert diffuse, phong specular, constant ambient and no emission
var S7 = `
    vec3 light1_dir = LADir;
    vec4 light1_color = LAlightColor;

    vec4 lambert1_diff = diffColor * clamp(dot(light1_dir,normalVec),0.0,1.0);

    vec3 r1 = -reflect(light1_dir, normalVec);
    vec4 phong1_spec = specularColor * pow(clamp(dot(eyedirVec, r1), 0.0, 1.0),SpecShine);


    vec3 light2_dir = normalize(LBPos - fs_pos);
    vec4 light2_color = LBlightColor;

    vec4 lambert2_diff = diffColor * clamp(dot(light2_dir,normalVec),0.0,1.0);

    vec3 r2 = -reflect(light2_dir, normalVec);
    vec4 phong2_spec = specularColor * pow(clamp(dot(eyedirVec, r2), 0.0, 1.0),SpecShine);


    vec3 light3_dir = normalize(LCPos - fs_pos);
    vec4 decay_factor = LClightColor * pow(LCTarget/length(LCPos - fs_pos),LCDecay);
    float cout = cos(radians(LCConeOut)/2.0);
    float cin = cos((LCConeIn * radians(LCConeOut))/2.0);
    float cone_factor = clamp((dot(light3_dir, LCDir) - cout)/(cin - cout), 0.0, 1.0);
    vec4 light3_color = decay_factor * cone_factor;

    vec4 lambert3_diff = diffColor * clamp(dot(light3_dir,normalVec),0.0,1.0);

    vec3 r3 = -reflect(light3_dir, normalVec);
    vec4 phong3_spec = specularColor * pow(clamp(dot(eyedirVec, r3), 0.0, 1.0),SpecShine);


    vec4 ambient = ambColor * ambientLightColor;


	vec4 out_color_noclamp = light1_color * ( lambert1_diff + phong1_spec ) + light2_color * ( lambert2_diff + phong2_spec ) + light3_color * ( lambert3_diff + phong3_spec ) + ambient ;

	out_color = clamp(out_color_noclamp, 0.0, 1.0);
`;
    
	return [S1, S2, S3, S4, S5, S6, S7];
}

