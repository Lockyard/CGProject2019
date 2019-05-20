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
	out_color = LAlightColor * diffColor * clamp( dot(LADir,normalVec),0.0,1.0);
`;
//`out_color = vec4(1.0, 0.0, 0.0, 1.0);`

// Single point light with decay, Lambert diffuse, Blinn specular, no ambient and no emission
/*/
	l*(decay) 		* (fdiffuse 						+ fspecular								)
	l*(g/|p-x|)^B 	* (md * clamp( norm(p-x) . nx)		+ ms * clamp (nx . norm ( lx + wr))		)
//*/
var S2 = `
	vec4 pointLight = LAlightColor * pow((LATarget / length(LAPos - fs_pos)), LADecay);
	vec4 lambDiffuse = diffColor * clamp( dot(normalize(LAPos - fs_pos), normalVec), 0.0, 1.0);
	vec4 blinnSpec = specularColor * pow(clamp( dot(normalVec, normalize(normalize(LAPos - fs_pos) + eyedirVec)), 0.0, 1.0), SpecShine);
	out_color =  pointLight * ( lambDiffuse + blinnSpec);
`;

// Single directional light, Lambert diffuse, Phong specular, constant ambient and emission
// Single point light with decay, Lambert diffuse, Blinn specular, no ambient and no emission
/*/
	l 		* (fdiffuse 						+ fspecular								)
	l 		* (md * clamp( norm(p-x) . nx)		+ ms * clamp (nx . norm ( lx + wr))		)
//*/
var S3 = `
	vec3 reflectedVec = (normalVec+normalVec) * dot(LADir, normalVec) - LADir;

	vec4 fdiffuse = diffColor * clamp( dot(LADir,normalVec),0.0,1.0);
	vec4 fspecular = specularColor * pow(clamp(dot(eyedirVec, reflectedVec), 0.0, 1.0), SpecShine);

	out_color = LAlightColor * ( fdiffuse + fspecular ) + ambientLightColor * ambColor +  emit;
`;

// Single spot light (with decay), Lambert diffuse, Blinn specular, no ambient and no emission
var S4 = `
	const float PI = 3.14159265358979;
	float Cout = cos(LAConeOut*PI/180.0/2.0);
	float Cin = cos( (LAConeOut*PI/180.0/2.0) * LAConeIn);
	vec3 lx = normalize(LAPos - fs_pos);
	float decay = pow((LATarget / length(LAPos - fs_pos)), LADecay);

	vec4 spotlight = LAlightColor * decay * clamp( (dot(lx, LADir) - Cout) / (Cin-Cout), 0.0, 1.0);
	vec4 lambertDiff = diffColor * clamp( dot(lx ,normalVec),0.0,1.0);
	vec4 blinnSpec = specularColor * pow(clamp( dot(normalVec, normalize(lx + eyedirVec)), 0.0, 1.0), SpecShine);

	out_color = spotlight * (lambertDiff + blinnSpec);
`;

// Single directional light, Cartoon diffuse, Cartoon specular, no ambient but emission
var S5 = `
	vec4 dirLight = LAlightColor;
	vec3 lx = LADir;
	vec4 cartDiffuse = dot(lx ,normalVec) >= DToonTh ? diffColor : vec4(0,0,0,0);
	vec3 reflectedVec = (normalVec+normalVec) * dot(LADir, normalVec) - lx;
	vec4 cartSpecular = dot(eyedirVec, reflectedVec) >= SToonTh ? specularColor : vec4(0,0,0,0);
	out_color = dirLight * (cartDiffuse + cartSpecular) + emit;
`;

// Single directional light, no diffuse, phong specular, hemispheric ambient and no emission
var S6 = `
	vec4 dirLight = LAlightColor;
	vec3 lx = LADir;
	vec3 reflectedVec = (normalVec+normalVec) * dot(LADir, normalVec) - lx;
	vec4 phongSpecular = specularColor * pow(clamp(dot(eyedirVec, reflectedVec), 0.0, 1.0), SpecShine);
	vec3 upnormal = vec3(0.0,1.0,0.0);
	float adjLU = (dot(normalVec, upnormal) + 1.0)/2.0;
	float adjLD = (1.0 - dot(normalVec, upnormal))/2.0;
	vec4 hemAmbient = ( adjLU*ambientLightColor + adjLD*ambientLightLowColor ) * ambColor;

	out_color = dirLight * (phongSpecular) + hemAmbient;
`;

// Three lights: a directional, a point and a spot. Lambert diffuse, phong specular, constant ambient and no emission
var S7 = `
	vec4 dirLight = LAlightColor;
	vec3 lxA = LADir;
	vec3 reflectedVecA = (normalVec+normalVec) * dot(lxA, normalVec) - lxA;
	vec4 lambDiffA = diffColor * clamp( dot(lxA,normalVec),0.0,1.0);
	vec4 phongSpecA = specularColor * pow(clamp(dot(eyedirVec, reflectedVecA), 0.0, 1.0), SpecShine);
	vec4 L1 = dirLight*(lambDiffA + phongSpecA);

	vec4 pointLight = LBlightColor * pow((LBTarget / length(LBPos - fs_pos)), LBDecay);
	vec3 lxB = normalize(LBPos - fs_pos);
	vec3 reflectedVecB = (normalVec+normalVec) * dot(lxB, normalVec) - lxB;
	vec4 lambDiffB = diffColor * clamp( dot(lxB,normalVec),0.0,1.0);
	vec4 phongSpecB = specularColor * pow(clamp(dot(eyedirVec, reflectedVecB), 0.0, 1.0), SpecShine);
	vec4 L2 = pointLight * (lambDiffB + phongSpecB);


	const float PI = 3.14159265358979;
	float Cout = cos(LCConeOut*PI/180.0/2.0);
	float Cin = cos( (LCConeOut*PI/180.0/2.0) * LCConeIn);
	vec3 lxC = normalize(LCPos - fs_pos);

	float decay = pow((LCTarget / length(LCPos - fs_pos)), LCDecay);
	vec4 spotlight = LClightColor * decay * clamp( (dot(lxC, LCDir) - Cout) / (Cin-Cout), 0.0, 1.0);
	vec3 reflectedVecC = (normalVec+normalVec) * dot(lxC, normalVec) - lxC;
	vec4 lambDiffC = diffColor * clamp( dot(lxC,normalVec),0.0,1.0);
	vec4 phongSpecC = specularColor * pow(clamp(dot(eyedirVec, reflectedVecC), 0.0, 1.0), SpecShine);
	vec4 L3 = spotlight*(lambDiffC + phongSpecC);

	vec4 ambient = ambientLightColor * ambColor;

	out_color = L1 + L2 + L3 + ambient;
`;
	return [S1, S2, S3, S4, S5, S6, S7];
}

