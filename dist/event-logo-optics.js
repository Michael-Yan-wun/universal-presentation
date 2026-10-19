import * as THREE from './vendor/three.module.js';

// A restrained macro-lens pass. The source stays linear/HDR until the last quad,
// where Three applies the renderer's exposure, tone mapping and output transform.
export function createLogoOptics(renderer){
  const physicalSize=new THREE.Vector2();
  const savedViewport=new THREE.Vector4(),savedScissor=new THREE.Vector4();
  const savedClearColor=new THREE.Color();
  const supportsHalfFloat=renderer.extensions.has('EXT_color_buffer_float');
  const target=new THREE.WebGLRenderTarget(1,1,{
    type:supportsHalfFloat?THREE.HalfFloatType:THREE.UnsignedByteType,
    format:THREE.RGBAFormat,
    minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,
    depthBuffer:true,stencilBuffer:false,
    generateMipmaps:false,
  });
  target.texture.colorSpace=THREE.LinearSRGBColorSpace;
  target.depthTexture=new THREE.DepthTexture(1,1,THREE.UnsignedIntType);
  target.depthTexture.minFilter=target.depthTexture.magFilter=THREE.NearestFilter;
  const uniforms={
    tColor:{value:target.texture},tDepth:{value:target.depthTexture},
    texel:{value:new THREE.Vector2(1,1)},
    nearClip:{value:.5},farClip:{value:2500},
    focusDistance:{value:100},strength:{value:1},
  };
  const material=new THREE.ShaderMaterial({
    uniforms,depthTest:false,depthWrite:false,blending:THREE.NoBlending,
    toneMapped:true,
    premultipliedAlpha:renderer.getContextAttributes()?.premultipliedAlpha??true,
    vertexShader:`
      varying vec2 vUv;
      void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}
    `,
    fragmentShader:`
      #include <common>
      #include <packing>
      varying vec2 vUv;
      uniform sampler2D tColor;
      uniform sampler2D tDepth;
      uniform vec2 texel;
      uniform float nearClip;
      uniform float farClip;
      uniform float focusDistance;
      uniform float strength;
      float lensRadius(vec2 uv){
        float z=-perspectiveDepthToViewZ(texture2D(tDepth,uv).x,nearClip,farClip);
        float miss=abs(z-focusDistance)/max(z*.075,1.0);
        return smoothstep(.06,1.0,miss)*4.8*strength;
      }
      void main(){
        vec4 center=texture2D(tColor,vUv);
        float radius=lensRadius(vUv);
        vec4 sum=center*2.0;
        float weights=2.0;
        // A deterministic golden-angle disk avoids a visible rotating kernel.
        // All radii are physical drawing-buffer pixels, including retina screens.
        for(int i=0;i<12;i++){
          float n=float(i)+.5;
          float diskRadius=sqrt(n/12.0);
          float a=n*2.39996323;
          vec2 offset=vec2(cos(a),sin(a))*diskRadius*radius;
          vec2 uv=clamp(vUv+offset*texel,texel*.5,vec2(1.0)-texel*.5);
          vec4 tap=texture2D(tColor,uv);
          float weight=1.0-.45*diskRadius;
          // Empty background may borrow only genuinely defocused silhouettes;
          // otherwise a sharp, focused metal edge would acquire a soft halo.
          if(center.a<.001){
            weight*=smoothstep(length(offset)*.55,length(offset)*.55+.6,lensRadius(uv));
          }
          sum+=tap*weight;
          weights+=weight;
        }
        vec4 color=sum/weights;
        // Target blending stores premultiplied coverage. Unpremultiply before
        // tone mapping, then restore the canvas's premultiplication convention.
        color.rgb=color.a>.00001?color.rgb/color.a:vec3(0.0);
        gl_FragColor=color;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <premultiplied_alpha_fragment>
      }
    `,
  });
  const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);
  quad.frustumCulled=false;
  const postScene=new THREE.Scene();postScene.add(quad);
  const postCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  let disposed=false;

  function resize(){
    if(disposed)return;
    renderer.getDrawingBufferSize(physicalSize);
    const width=Math.max(1,Math.round(physicalSize.x));
    const height=Math.max(1,Math.round(physicalSize.y));
    if(target.width!==width||target.height!==height)target.setSize(width,height);
    uniforms.texel.value.set(1/width,1/height);
  }
  function render(scene,camera,focusDistance,strength=1){
    if(disposed||!Number.isFinite(strength)||strength<=.001){
      renderer.render(scene,camera);return;
    }
    resize();
    const previousTarget=renderer.getRenderTarget();
    const previousAutoClear=renderer.autoClear;
    const previousClearAlpha=renderer.getClearAlpha();
    const previousScissorTest=renderer.getScissorTest();
    renderer.getViewport(savedViewport);renderer.getScissor(savedScissor);
    renderer.getClearColor(savedClearColor);
    uniforms.nearClip.value=camera.near;
    uniforms.farClip.value=camera.far;
    uniforms.focusDistance.value=Math.max(camera.near,Number.isFinite(focusDistance)?focusDistance:100);
    uniforms.strength.value=THREE.MathUtils.clamp(strength,0,1);
    try{
      renderer.autoClear=true;renderer.setScissorTest(false);
      renderer.setRenderTarget(target);renderer.setClearColor(0x000000,0);
      renderer.render(scene,camera);
      renderer.setRenderTarget(previousTarget);
      renderer.setViewport(savedViewport);renderer.setScissor(savedScissor);
      renderer.setScissorTest(previousScissorTest);
      renderer.render(postScene,postCamera);
    }finally{
      renderer.setRenderTarget(previousTarget);
      renderer.setViewport(savedViewport);renderer.setScissor(savedScissor);
      renderer.setScissorTest(previousScissorTest);
      renderer.setClearColor(savedClearColor,previousClearAlpha);
      renderer.autoClear=previousAutoClear;
    }
  }
  function dispose(){
    if(disposed)return;
    disposed=true;target.depthTexture.dispose();target.dispose();
    quad.geometry.dispose();material.dispose();postScene.clear();
  }
  return {resize,render,dispose};
}
