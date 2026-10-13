// Physics Objects System (SVR 2011+ Style)
// Tables, Ladders, Chairs, Announce Table with dynamic physics

import * as THREE from 'three';

export const PHYSICS_OBJECTS_CONFIG = {
  // Table
  TABLE: {
    dimensions: { width: 2.1, height: 0.09, depth: 1.0 },
    mass: 15,
    health: 100,
    breakThreshold: 50,
    breakForce: 500,
    debrisCount: 8,
    debrisLifetime: 10,
    sounds: { hit: 'table_hit', break: 'table_break' },
    materials: {
      wood: { color: 0x7a4a22, roughness: 0.8, metalness: 0.1 },
      metal: { color: 0x444444, roughness: 0.4, metalness: 0.8 },
    },
  },

  // Ladder
  LADDER: {
    dimensions: { width: 0.6, height: 4.5, depth: 0.15 },
    mass: 25,
    health: 200,
    breakThreshold: 100,
    breakForce: 800,
    climbable: true,
    leanable: true,
    restOnRopes: true,
    breakable: true,
    sounds: { hit: 'ladder_hit', break: 'ladder_break', climb: 'ladder_climb' },
    materials: {
      metal: { color: 0x666666, roughness: 0.3, metalness: 0.9 },
    },
  },

  // Chair
  CHAIR: {
    dimensions: { width: 0.5, height: 0.9, depth: 0.5 },
    mass: 8,
    health: 80,
    breakThreshold: 30,
    breakForce: 300,
    throwable: true,
    swingable: true,
    debrisCount: 4,
    sounds: { hit: 'chair_hit', throw: 'chair_throw', break: 'chair_break' },
    materials: {
      metal: { color: 0x8888a0, roughness: 0.35, metalness: 0.7 },
      seat: { color: 0x1a1a1a, roughness: 0.5, metalness: 0.1 },
    },
  },

  // Announce Table
  ANNOUNCE_TABLE: {
    dimensions: { width: 3.0, height: 0.75, depth: 1.5 },
    mass: 50,
    health: 200,
    breakThreshold: 80,
    breakForce: 1000,
    removableCover: true,
    monitor: true,
    monitors: 2,
    debrisCount: 12,
    sounds: { hit: 'table_hit', break: 'announce_table_break', cover: 'cover_remove' },
    materials: {
      wood: { color: 0x2a2a2a, roughness: 0.7, metalness: 0.1 },
      monitor: { color: 0x111111, roughness: 0.1, metalness: 0.9, emissive: 0x333333 },
    },
  },

  // Trash Can
  TRASH_CAN: {
    dimensions: { width: 0.4, height: 0.6, depth: 0.4 },
    mass: 5,
    health: 50,
    breakThreshold: 20,
    breakForce: 200,
    throwable: true,
    sounds: { hit: 'trash_hit', break: 'trash_break' },
    materials: {
      metal: { color: 0x333333, roughness: 0.5, metalness: 0.7 },
    },
  },

  // Steel Steps
  STEEL_STEPS: {
    dimensions: { width: 1.2, height: 1.0, depth: 1.5 },
    mass: 80,
    health: 500,
    breakable: false,
    climbable: true,
    sounds: { hit: 'steel_hit', climb: 'step_climb' },
    materials: {
      steel: { color: 0x555555, roughness: 0.2, metalness: 0.95 },
    },
  },

  // Ring Bell
  RING_BELL: {
    dimensions: { width: 0.6, height: 0.6, depth: 0.6 },
    mass: 15,
    health: 100,
    breakable: false,
    ringable: true,
    sounds: { hit: 'bell_ring' },
    materials: {
      brass: { color: 0xd4a843, roughness: 0.2, metalness: 0.9 },
    },
  },
};

// Base Physics Object Class
export class PhysicsObject {
  constructor(type, config, position = new THREE.Vector3()) {
    this.type = type;
    this.config = config;
    this.position = position.clone();
    this.rotation = new THREE.Euler(0, 0, 0);
    this.velocity = new THREE.Vector3();
    this.angularVelocity = new THREE.Vector3();
    
    // Physics properties
    this.mass = config.mass || 10;
    this.health = config.health || 100;
    this.maxHealth = config.health || 100;
    this.broken = false;
    this.breakThreshold = config.breakThreshold || 50;
    this.breakForce = config.breakForce || 500;
    
    // State
    this.grounded = false;
    this.held = false;
    this.heldBy = null;
    this.thrown = false;
    this.leaning = false;
    this.leanDirection = new THREE.Vector3();
    this.climbed = false;
    this.climber = null;
    
    // Three.js mesh
    this.mesh = null;
    this.debrisMeshes = [];
    
    // Callbacks
    this.onHit = null;
    this.onBreak = null;
    this.onPickup = null;
    this.onThrow = null;
    this.onBreak = null;
    this.onClimb = null;
  }

  // Create Three.js mesh
  createMesh() {
    const geo = this.createGeometry();
    const mat = this.createMaterial();
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.copy(this.rotation);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData.physicsObject = this;
    return this.mesh;
  }

  createGeometry() {
    const { width, height, depth } = this.config.dimensions;
    return new THREE.BoxGeometry(width, height, depth);
  }

  createMaterial() {
    const matConfig = this.config.materials?.default || this.config.materials?.wood || this.config.materials?.metal;
    if (!matConfig) {
      return new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.1 });
    }
    return new THREE.MeshStandardMaterial({
      color: matConfig.color || 0x888888,
      roughness: matConfig.roughness || 0.5,
      metalness: matConfig.metalness || 0.1,
      emissive: matConfig.emissive || 0x000000,
    });
  }

  // Apply damage
  takeDamage(amount, force = new THREE.Vector3(), attacker = null) {
    if (this.broken) return false;
    
    this.health = Math.max(0, this.health - amount);
    
    // Apply physics impulse
    if (force.length() > 0) {
      this.velocity.add(force.clone().multiplyScalar(1 / this.mass));
    }
    
    // Check break
    if (this.health <= this.breakThreshold) {
      this.break(force, attacker);
      return true;
    }
    
    if (this.onHit) this.onHit(amount, force, attacker);
    return false;
  }

  // Break object
  break(force = new THREE.Vector3(), attacker = null) {
    if (this.broken) return;
    
    this.broken = true;
    this.velocity.add(force.clone().multiplyScalar(2 / this.mass));
    
    // Create debris
    this.createDebris();
    
    // Hide main mesh
    if (this.mesh) {
      this.mesh.visible = false;
    }
    
    if (this.onBreak) this.onBreak(this, force, attacker);
    
    // Emit break event
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('objectBreak', {
        detail: { object: this, force, attacker }
      }));
    }
  }

  // Create debris pieces
  createDebris() {
    const count = this.config.debrisCount || 4;
    const { width, height, depth } = this.config.dimensions;
    
    for (let i = 0; i < count; i++) {
      const size = new THREE.Vector3(
        width * (0.2 + Math.random() * 0.3),
        height * (0.2 + Math.random() * 0.3),
        depth * (0.2 + Math.random() * 0.3)
      );
      
      const geo = new THREE.BoxGeometry(size.x, size.y, size.z);
      const mat = this.mesh?.material?.clone() || new THREE.MeshStandardMaterial({ color: 0x888888 });
      
      const debris = new THREE.Mesh(geo, mat);
      debris.position.copy(this.position);
      debris.position.add(new THREE.Vector3(
        (Math.random() - 0.5) * width,
        (Math.random() - 0.5) * height,
        (Math.random() - 0.5) * depth
      ));
      debris.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      debris.castShadow = true;
      
      // Physics
      debris.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 10
      );
      debris.angularVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      debris.lifetime = this.config.debrisLifetime || 10;
      debris.userData = { debris: true, parent: this };
      
      this.debrisMeshes.push(debris);
    }
  }

  // Update debris
  updateDebris(dt) {
    for (let i = this.debrisMeshes.length - 1; i >= 0; i--) {
      const debris = this.debrisMeshes[i];
      debris.lifetime -= dt;
      
      // Apply gravity
      debris.velocity.y -= 9.8 * dt;
      debris.position.addScaledVector(debris.velocity, dt);
      debris.rotation.x += debris.angularVelocity.x * dt;
      debris.rotation.y += debris.angularVelocity.y * dt;
      debris.rotation.z += debris.angularVelocity.z * dt;
      
      // Ground collision
      if (debris.position.y <= size.y / 2) {
        debris.position.y = size.y / 2;
        debris.velocity.y *= -0.3;
        debris.velocity.x *= 0.8;
        debris.velocity.z *= 0.8;
        debris.angularVelocity.multiplyScalar(0.8);
      }
      
      // Expired
      if (debris.lifetime <= 0) {
        if (debris.parent) debris.parent.remove(debris);
        this.debrisMeshes.splice(i, 1);
      }
    }
  }

  // Pick up object
  pickup(wrestler) {
    if (this.held || this.broken) return false;
    if (this.config.mass > wrestler.maxLiftWeight) return false;
    
    this.held = true;
    this.heldBy = wrestler;
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    
    if (this.mesh) {
      wrestler.parts.group.add(this.mesh);
      this.mesh.position.set(0, 1.2, 0.5);
      this.mesh.rotation.set(0, 0, 0);
    }
    
    if (this.onPickup) this.onPickup(wrestler);
    return true;
  }

  // Drop object
  drop() {
    if (!this.held) return false;
    
    this.held = false;
    this.heldBy = null;
    
    if (this.mesh && this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
      // Add to scene
      if (this.scene) this.scene.add(this.mesh);
    }
    
    // Small drop velocity
    this.velocity.y = 2;
    return true;
  }

  // Throw object
  throw(direction, force = 15) {
    if (!this.held) return false;
    
    this.drop();
    this.thrown = true;
    this.velocity.copy(direction).multiplyScalar(force);
    this.velocity.y += 5; // upward arc
    
    // Spin
    this.angularVelocity.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    
    if (this.onThrow) this.onThrow(direction, force);
    return true;
  }

  // Swing (for chairs)
  swing(wrestler, target) {
    if (!this.held || this.heldBy !== wrestler) return false;
    
    // Swing animation would be handled by animation system
    // Apply damage on hit
    const damage = 15;
    // target.takeDamage(damage, ...)
    
    if (this.onSwing) this.onSwing(target);
    return true;
  }

  // Update physics
  update(dt, scene) {
    if (!this.mesh) return;
    
    // Update debris
    this.updateDebris(dt);
    
    if (this.held && this.heldBy) {
      // Follow holder
      return;
    }
    
    if (this.thrown || !this.grounded) {
      // Apply gravity
      this.velocity.y -= 9.8 * dt;
      this.position.addScaledVector(this.velocity, dt);
      
      // Apply rotation
      this.rotation.x += this.angularVelocity.x * dt;
      this.rotation.y += this.angularVelocity.y * dt;
      this.rotation.z += this.angularVelocity.z * dt;
      
      // Air resistance
      this.velocity.multiplyScalar(0.99);
      this.angularVelocity.multiplyScalar(0.98);
      
      // Ground collision
      if (this.position.y <= this.config.dimensions.height / 2) {
        this.position.y = this.config.dimensions.height / 2;
        this.velocity.y = Math.abs(this.velocity.y) * 0.3;
        this.velocity.x *= 0.7;
        this.velocity.z *= 0.7;
        this.angularVelocity.multiplyScalar(0.5);
        this.grounded = true;
        this.thrown = false;
        
        // Check break on impact
        const impactForce = this.velocity.length();
        if (impactForce > this.breakForce / this.mass) {
          this.break(this.velocity.clone().multiplyScalar(this.mass));
        }
      }
    }
    
    // Update mesh
    if (this.mesh) {
      this.mesh.position.copy(this.position);
      this.mesh.rotation.copy(this.rotation);
    }
  }

  // Lean object (ladders)
  lean(against, angle = Math.PI / 6) {
    if (this.leaning) return false;
    if (!this.config.leanable) return false;
    
    this.leaning = true;
    this.leanDirection.copy(against.position).sub(this.position).normalize();
    this.rotation.y = Math.atan2(this.leanDirection.x, this.leanDirection.z);
    this.rotation.x = -angle;
    this.rotation.z = 0;
    
    if (this.onLean) this.onLean(against);
    return true;
  }

  // Climb (ladders)
  startClimb(wrestler) {
    if (!this.config.climbable) return false;
    if (this.climbed) return false;
    
    this.climbed = true;
    this.climber = wrestler;
    wrestler.state = 'climbing';
    wrestler.climbTarget = this;
    
    if (this.onClimb) this.onClimb(wrestler);
    return true;
  }

  endClimb(wrestler) {
    if (!this.climbed || this.climber !== wrestler) return false;
    
    this.climbed = false;
    this.climber = null;
    wrestler.state = 'idle';
    wrestler.climbTarget = null;
    return true;
  }

  // Clear cover (announce table)
  clearCover() {
    if (this.config.removableCover && !this.coverRemoved) {
      this.coverRemoved = true;
      // Remove cover mesh
      if (this.coverMesh) {
        this.coverMesh.visible = false;
      }
      return true;
    }
    return false;
  }

  // Get state for UI
  getState() {
    return {
      type: this.type,
      position: this.position.toArray(),
      rotation: this.rotation.toArray(),
      health: this.health,
      maxHealth: this.maxHealth,
      broken: this.broken,
      held: this.held,
      thrown: this.thrown,
      grounded: this.grounded,
      leaning: this.leaning,
      climbed: this.climbed,
      coverRemoved: this.coverRemoved,
    };
  }
}

// Specific Object Classes
export class Table extends PhysicsObject {
  constructor(position) {
    super('table', PHYSICS_OBJECTS_CONFIG.TABLE, position);
  }
  
  createGeometry() {
    const { width, height, depth } = this.config.dimensions;
    const group = new THREE.Group();
    
    // Table top
    const topGeo = new THREE.BoxGeometry(width, height, depth);
    const topMesh = new THREE.Mesh(topGeo, this.createMaterial());
    topMesh.position.y = height / 2;
    group.add(topMesh);
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.6 });
    const legPositions = [
      [-width/2 + 0.1, 0, -depth/2 + 0.1],
      [width/2 - 0.1, 0, -depth/2 + 0.1],
      [-width/2 + 0.1, 0, depth/2 - 0.1],
      [width/2 - 0.1, 0, depth/2 - 0.1],
    ];
    
    for (const [x, y, z] of legPositions) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.35, z);
      group.add(leg);
    }
    
    return group;
  }
}

export class Ladder extends PhysicsObject {
  constructor(position) {
    super('ladder', PHYSICS_OBJECTS_CONFIG.LADDER, position);
  }
  
  createGeometry() {
    const { width, height, depth } = this.config.dimensions;
    const group = new THREE.Group();
    
    // Side rails
    const railGeo = new THREE.BoxGeometry(0.03, height, 0.03);
    const railMat = this.createMaterial();
    
    for (const x of [-width/2 + 0.015, width/2 - 0.015]) {
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(x, height/2, 0);
      group.add(rail);
    }
    
    // Rungs
    const rungGeo = new THREE.CylinderGeometry(0.02, 0.02, width - 0.06, 8);
    const rungMat = this.createMaterial();
    const rungCount = Math.floor(height / 0.4);
    
    for (let i = 0; i < rungCount; i++) {
      const rung = new THREE.Mesh(rungGeo, rungMat);
      rung.position.set(0, (i + 0.5) * (height / rungCount), 0);
      rung.rotation.z = Math.PI / 2;
      group.add(rung);
    }
    
    return group;
  }
}

export class Chair extends PhysicsObject {
  constructor(position) {
    super('chair', PHYSICS_OBJECTS_CONFIG.CHAIR, position);
  }
  
  createGeometry() {
    const { width, height, depth } = this.config.dimensions;
    const group = new THREE.Group();
    
    // Seat
    const seatGeo = new THREE.BoxGeometry(width, 0.06, depth);
    const seatMesh = new THREE.Mesh(seatGeo, this.config.materials.seat);
    seatMesh.position.y = 0.5;
    group.add(seatMesh);
    
    // Back
    const backGeo = new THREE.BoxGeometry(width, height - 0.5, 0.05);
    const backMesh = new THREE.Mesh(backGeo, this.config.materials.metal);
    backMesh.position.set(0, height/2 + 0.25, -depth/2 + 0.025);
    group.add(backMesh);
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8);
    const legMat = this.config.materials.metal;
    
    for (const [x, z] of [[-width/2+0.05, -depth/2+0.05], [width/2-0.05, -depth/2+0.05], [-width/2+0.05, depth/2-0.05], [width/2-0.05, depth/2-0.05]]) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.25, z);
      group.add(leg);
    }
    
    return group;
  }
}

export class AnnounceTable extends PhysicsObject {
  constructor(position) {
    super('announce_table', PHYSICS_OBJECTS_CONFIG.ANNOUNCE_TABLE, position);
    this.coverRemoved = false;
  }
  
  createGeometry() {
    const { width, height, depth } = this.config.dimensions;
    const group = new THREE.Group();
    
    // Main table
    const tableGeo = new THREE.BoxGeometry(width, height * 0.8, depth);
    const tableMesh = new THREE.Mesh(tableGeo, this.config.materials.wood);
    tableMesh.position.y = height * 0.4;
    group.add(tableMesh);
    
    // Cover (removable)
    const coverGeo = new THREE.BoxGeometry(width * 1.02, 0.1, depth * 1.02);
    this.coverMesh = new THREE.Mesh(coverGeo, this.config.materials.wood);
    this.coverMesh.position.y = height * 0.8 + 0.05;
    group.add(this.coverMesh);
    
    // Monitors
    if (this.config.monitors) {
      const monitorGeo = new THREE.BoxGeometry(0.5, 0.35, 0.05);
      for (let i = 0; i < this.config.monitors; i++) {
        const monitor = new THREE.Mesh(monitorGeo, this.config.materials.monitor);
        monitor.position.set(
          (i - (this.config.monitors - 1) / 2) * 0.7,
          height * 0.6,
          depth / 2 - 0.025
        );
        group.add(monitor);
      }
    }
    
    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, height * 0.8, 0.1);
    const legMat = this.config.materials.wood;
    for (const [x, z] of [[-width/2+0.1, -depth/2+0.1], [width/2-0.1, -depth/2+0.1], [-width/2+0.1, depth/2-0.1], [width/2-0.1, depth/2-0.1]]) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, height * 0.4, z);
      group.add(leg);
    }
    
    return group;
  }
  
  removeCover() {
    if (this.coverRemoved) return false;
    this.coverRemoved = true;
    if (this.coverMesh) {
      this.coverMesh.visible = false;
      // Spawn cover debris
      this.spawnCoverDebris();
    }
    return true;
  }
  
  spawnCoverDebris() {
    // Create cover pieces that fly off
    const debris = new PhysicsObject('cover_piece', {
      ...PHYSICS_OBJECTS_CONFIG.ANNOUNCE_TABLE,
      dimensions: { width: 1.0, height: 0.05, depth: 0.5 },
      mass: 2,
      health: 20,
    }, this.position.clone());
    
    debris.mesh = this.coverMesh;
    debris.velocity.set(
      (Math.random() - 0.5) * 5,
      5,
      (Math.random() - 0.5) * 5
    );
    debris.angularVelocity.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    );
    
    return debris;
  }
}

export class SteelSteps extends PhysicsObject {
  constructor(position) {
    super('steel_steps', PHYSICS_OBJECTS_CONFIG.STEEL_STEPS, position);
  }
}

export class RingBell extends PhysicsObject {
  constructor(position) {
    super('ring_bell', PHYSICS_OBJECTS_CONFIG.RING_BELL, position);
  }
  
  ring() {
    if (this.onRing) this.onRing();
  }
}

// Physics Object Manager
export class PhysicsObjectManager {
  constructor(scene) {
    this.scene = scene;
    this.objects = [];
    this.objectPool = new Map();
    this.nextId = 0;
  }
  
  // Spawn object
  spawn(type, position, config = {}) {
    let obj;
    const baseConfig = PHYSICS_OBJECTS_CONFIG[type.toUpperCase()];
    const mergedConfig = { ...baseConfig, ...config };
    
    switch (type.toLowerCase()) {
      case 'table': obj = new Table(position); break;
      case 'ladder': obj = new Ladder(position); break;
      case 'chair': obj = new Chair(position); break;
      case 'announce_table': obj = new AnnounceTable(position); break;
      case 'steel_steps': obj = new SteelSteps(position); break;
      case 'ring_bell': obj = new RingBell(position); break;
      default:
        obj = new PhysicsObject(type, mergedConfig, position);
    }
    
    obj.id = this.nextId++;
    obj.createMesh();
    obj.scene = this.scene;
    this.scene.add(obj.mesh);
    
    // Add debris to scene
    for (const debris of obj.debrisMeshes) {
      this.scene.add(debris);
    }
    
    this.objects.push(obj);
    return obj;
  }
  
  // Spawn preset objects for match
  spawnMatchObjects(matchType = 'normal') {
    const objects = [];
    
    // Always spawn ring bell
    objects.push(this.spawn('ring_bell', new THREE.Vector3(0, 0, 5.5)));
    
    // Spawn steel steps
    objects.push(this.spawn('steel_steps', new THREE.Vector3(5, 0.5, 0)));
    objects.push(this.spawn('steel_steps', new THREE.Vector3(-5, 0.5, 0)));
    
    if (matchType === 'hardcore' || matchType === 'tables_ladders_chairs') {
      // Tables
      objects.push(this.spawn('table', new THREE.Vector3(6, 0.5, 3)));
      objects.push(this.spawn('table', new THREE.Vector3(-6, 0.5, -3)));
      
      // Ladders
      objects.push(this.spawn('ladder', new THREE.Vector3(0, 0, 6)));
      
      // Chairs
      objects.push(this.spawn('chair', new THREE.Vector3(4, 0.5, 4)));
      objects.push(this.spawn('chair', new THREE.Vector3(-4, 0.5, -4)));
      
      // Announce table
      objects.push(this.spawn('announce_table', new THREE.Vector3(0, 0.75, -10)));
    }
    
    return objects;
  }
  
  // Update all objects
  update(dt) {
    for (const obj of this.objects) {
      obj.update(dt, this.scene);
    }
    
    // Remove expired debris
    this.objects = this.objects.filter(obj => {
      if (obj.broken && obj.debrisMeshes.length === 0 && !obj.held) {
        if (obj.mesh && obj.mesh.parent) {
          obj.mesh.parent.remove(obj.mesh);
        }
        return false;
      }
      return true;
    });
  }
  
  // Get object by ID
  getObject(id) {
    return this.objects.find(obj => obj.id === id);
  }
  
  // Get objects near position
  getObjectsNear(position, radius = 3) {
    return this.objects.filter(obj => {
      if (obj.broken) return false;
      return obj.position.distanceTo(position) < radius;
    });
  }
  
  // Cleanup
  dispose() {
    for (const obj of this.objects) {
      if (obj.mesh && obj.mesh.parent) {
        obj.mesh.parent.remove(obj.mesh);
      }
      for (const debris of obj.debrisMeshes) {
        if (debris.parent) debris.parent.remove(debris);
        debris.geometry.dispose();
        if (debris.material) debris.material.dispose();
      }
      if (obj.mesh) {
        obj.mesh.geometry.dispose();
        if (obj.mesh.material) {
          if (Array.isArray(obj.mesh.material)) {
            obj.mesh.material.forEach(m => m.dispose());
          } else {
            obj.mesh.material.dispose();
          }
        }
      }
    }
    this.objects = [];
  }
}

export default {
  PhysicsObject,
  Table,
  Ladder,
  Chair,
  AnnounceTable,
  SteelSteps,
  RingBell,
  PhysicsObjectManager,
  PHYSICS_OBJECTS_CONFIG,
};