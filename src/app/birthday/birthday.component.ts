import { Component, OnInit } from '@angular/core';
import * as THREE from 'three.js';
import { fragmentShader } from './fragmentShader';

declare var __INITIAL_DATA__: any;

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.css']
})
export class BirthdayComponent implements OnInit {

  private canvas: HTMLCanvasElement = null;
  private renderer: any = null;
  private camera: any = null;
  private scene: any = null;
  private plane: any = null;
  private material: any = null;
  private uniforms: any = null;

  constructor() {
    (window as any).__INITIAL_DATA__ = this;
  }
  
  private render(time) {
    time *= 0.001;  // convert to seconds
    const thes = (window as any).__INITIAL_DATA__;
    thes.resizeRendererToDisplaySize(thes.renderer);
    const canvas = thes.renderer.domElement;
    thes.uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    thes.uniforms.iTime.value = time;
    thes.uniforms.iDate.value.w = time;
    thes.renderer.render(thes.scene, thes.camera);
    requestAnimationFrame(thes.render);
  }

  public resizeRendererToDisplaySize(renderer) {
    const thes = (window as any).__INITIAL_DATA__;
    const canvas = thes.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  ngOnInit(): void {
    this.canvas = document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.autoClearColor = false;
    this.camera = new THREE.OrthographicCamera(
      -1, // left
      1, // right
      1, // top
      -1, // bottom
      -1, // near,
      1, // far
    );
    this.scene = new THREE.Scene();
    this.plane = new THREE.PlaneBufferGeometry(2, 2);
    this.uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3() },
      iDate: { value: new THREE.Vector4(2020,10,11,0) },
    };
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader,
      uniforms: this.uniforms,
    });
    
    this.scene.add(new THREE.Mesh(this.plane, this.material));
    requestAnimationFrame(this.render);
  }

}
