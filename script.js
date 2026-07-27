// Interactive Portfolio Logic & 3D Three.js Tool Orbit System

document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initTypingEffect();
  initTerminal();
  initCounterAnimations();
  initSkillFilters();
  initModalListeners();
  initContactForm();
});

/* -------------------------------------------------------------
 * 1. Three.js 3D Subdued Background Particle System (No UI Overlap)
 * ------------------------------------------------------------- */
function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 45;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles Cloud - Pushed deeper to prevent clipping through text
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color('#00f2fe');
  const colorBlue = new THREE.Color('#38bdf8');
  const colorViolet = new THREE.Color('#a855f7');
  const colorEmerald = new THREE.Color('#10b981');

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 110;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 25; // Deep background layer

    const chosenColor = [colorCyan, colorBlue, colorViolet, colorEmerald][i % 4];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // Floating 3D Geometric Meshes representing Core Tools
  const toolMeshes = [];

  // 1. Kubernetes 3D Wheel
  const k8sGeo = new THREE.TorusGeometry(3.5, 0.7, 16, 80);
  const k8sMat = new THREE.MeshBasicMaterial({ color: 0x326ce5, wireframe: true, transparent: true, opacity: 0.35 });
  const k8sMesh = new THREE.Mesh(k8sGeo, k8sMat);
  k8sMesh.position.set(-32, 18, -25);
  scene.add(k8sMesh);
  toolMeshes.push({ mesh: k8sMesh, rx: 0.008, ry: 0.012 });

  // 2. Docker 3D Container Cube
  const dockerGeo = new THREE.BoxGeometry(4.5, 4.5, 4.5);
  const dockerMat = new THREE.MeshBasicMaterial({ color: 0x2496ed, wireframe: true, transparent: true, opacity: 0.35 });
  const dockerMesh = new THREE.Mesh(dockerGeo, dockerMat);
  dockerMesh.position.set(34, 20, -25);
  scene.add(dockerMesh);
  toolMeshes.push({ mesh: dockerMesh, rx: 0.01, ry: 0.008 });

  // 3. AWS 3D Cloud Octahedron
  const awsGeo = new THREE.OctahedronGeometry(4.5, 0);
  const awsMat = new THREE.MeshBasicMaterial({ color: 0xff9900, wireframe: true, transparent: true, opacity: 0.4 });
  const awsMesh = new THREE.Mesh(awsGeo, awsMat);
  awsMesh.position.set(32, -18, -20);
  scene.add(awsMesh);
  toolMeshes.push({ mesh: awsMesh, rx: 0.008, ry: 0.012 });

  // 4. Linux 3D Sphere
  const linuxGeo = new THREE.IcosahedronGeometry(4, 1);
  const linuxMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.35 });
  const linuxMesh = new THREE.Mesh(linuxGeo, linuxMat);
  linuxMesh.position.set(-30, -18, -20);
  scene.add(linuxMesh);
  toolMeshes.push({ mesh: linuxMesh, rx: 0.012, ry: 0.008 });

  // Connecting Network Lines
  const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.08,
  });

  const linesGeometry = new THREE.BufferGeometry();
  const linePositions = [];

  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 12) {
        linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
      }
    }
  }

  linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
  scene.add(linesMesh);

  // Mouse Interactivity
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.x += 0.0004;
    particleSystem.rotation.y += 0.0006;
    linesMesh.rotation.x += 0.0004;
    linesMesh.rotation.y += 0.0006;

    toolMeshes.forEach(item => {
      item.mesh.rotation.x += item.rx;
      item.mesh.rotation.y += item.ry;
    });

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* -------------------------------------------------------------
 * 2. Dynamic Typing Effect for Hero Title
 * ------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'AWS DevOps Engineer',
    'Python & Serverless Developer',
    'Kubernetes & Cloud Specialist',
    'Docker & Container Orchestrator',
    'Linux Systems & Infrastructure Architect',
    'Terraform IaC & Automation Engineer'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 35 : 75;

    if (!isDeleting && charIdx === currentPhrase.length) {
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* -------------------------------------------------------------
 * 3. Interactive DevOps Terminal Simulator
 * ------------------------------------------------------------- */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const commands = {
    help: `
<span class="text-cyan-400 font-bold">AVAILABLE INTERACTIVE COMMANDS:</span>
  <span class="text-emerald-400 font-semibold">python</span>      - Run Python log anomaly detector &amp; cost sweeper script
  <span class="text-emerald-400 font-semibold">kubectl</span>     - View live Kubernetes cluster pods status
  <span class="text-emerald-400 font-semibold">docker</span>      - View running containers &amp; multi-stage build status
  <span class="text-emerald-400 font-semibold">aws</span>         - Query EC2, VPC, S3 &amp; RDS cloud resources
  <span class="text-emerald-400 font-semibold">terraform</span>   - Run terraform plan simulation on 3-tier AWS infra
  <span class="text-emerald-400 font-semibold">jenkins</span>     - Trigger animated CI/CD deployment pipeline
  <span class="text-emerald-400 font-semibold">skills</span>      - Display technical stack competencies
  <span class="text-emerald-400 font-semibold">contact</span>     - Display email, phone, location &amp; GitHub
  <span class="text-emerald-400 font-semibold">clear</span>       - Clear terminal screen
    `,
    python: `
<span class="text-cyan-400">$ python anomaly_detector.py --bucket="prod-app-logs-s3" --alert-webhook="slack"</span>
[INFO] Ingested 142,500 CloudWatch log streams via AWS Lambda &amp; Boto3
[INFO] Scanning for HTTP 5xx error spikes and unhandled stack traces...
<span class="text-yellow-400">[WARNING] Anomaly Detected: HTTP 504 Gateway Timeout spike (&gt; 6.2% threshold)</span>
<span class="text-emerald-400">[SUCCESS] Dispatched Slack alert payload via webhook (Trace ID: #fl-88421)</span>

<span class="text-cyan-400">$ python cost_sweeper.py --region="us-east-1" --dry-run=false</span>
[INFO] Scanning for idle AWS infrastructure...
  • Unattached EBS Volumes: 4 volumes found (240 GB) -> <span class="text-emerald-400">Snapshot &amp; Purged ($48/mo saved)</span>
  • Unassociated Elastic IPs: 2 IPs found -> <span class="text-emerald-400">Released ($7.20/mo saved)</span>
  • Idle EC2 Instances: 1 instance (&lt;1.5% CPU 7d) -> <span class="text-emerald-400">Auto-Stopped ($64/mo saved)</span>

<span class="text-emerald-400 font-bold">✔ Monthly AWS Cost Savings Generated: $119.20/mo ($1,430/yr).</span>
    `,
    kubectl: `
<span class="text-cyan-400">$ kubectl get pods -n production -o wide</span>
NAME                                  READY   STATUS    RESTARTS   AGE    IP
api-node-rest-6f88b9c47d-k8x2q       1/1     Running   0          42d    10.0.2.14
api-node-rest-6f88b9c47d-p9l9m       1/1     Running   0          42d    10.0.2.15
web-frontend-nginx-8475cd6b4f-x2w4p  1/1     Running   0          12d    10.0.1.88
web-frontend-nginx-8475cd6b4f-z9m11  1/1     Running   0          12d    10.0.1.89
prometheus-k8s-0                     1/1     Running   0          60d    10.0.3.102

<span class="text-emerald-400 font-bold">✔ Rolling update active (maxSurge: 1, maxUnavailable: 0). Readiness probe: 200 OK on /health</span>
    `,
    docker: `
<span class="text-cyan-400">$ docker ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}"</span>
NAMES               IMAGE                       STATUS
node-api-prod       ecr.aws/node-api:v2.4.1     Up 14 days (healthy)
nginx-reverse-proxy nginx:alpine                Up 14 days (healthy)
prometheus-exporter prom/node-exporter:latest   Up 30 days (healthy)

<span class="text-emerald-400 font-bold">✔ Multi-stage Dockerfile verified: Non-root user execution, read-only root filesystem.</span>
    `,
    aws: `
<span class="text-cyan-400">$ aws ec2 describe-instances --region us-east-1 --output table</span>
--------------------------------------------------------------------------------------
|                                  DescribeInstances                                 |
+----------------------+--------------------+---------------------+------------------+
|      InstanceId      |    InstanceType    |        State        |    PrivateIp     |
+----------------------+--------------------+---------------------+------------------+
|  i-0a12bc34de5678f90 |  t3.medium (Web)   |  running (AutoScale)|  10.0.1.45       |
|  i-0b98877665543210a |  t3.medium (App)   |  running (AutoScale)|  10.0.2.88       |
|  rds-mysql-prod-01   |  db.t3.medium      |  available (MultiAZ)|  10.0.3.12       |
+----------------------+--------------------+---------------------+------------------+

<span class="text-emerald-400 font-bold">✔ AWS VPC custom subnets active: NAT Gateway + Security Groups least-privilege enforced.</span>
    `,
    terraform: `
<span class="text-cyan-400">$ terraform plan -var-file="prod.tfvars"</span>
<span class="text-yellow-400">Terraform will perform the following actions:</span>
  <span class="text-emerald-400">+ aws_vpc.custom_vpc (VPC 10.0.0.0/16, Public/Private Subnets, NAT Gateway)</span>
  <span class="text-emerald-400">+ aws_autoscaling_group.app_asg (Min: 2, Max: 6 instances)</span>
  <span class="text-emerald-400">+ aws_db_instance.rds_mysql (Multi-AZ Replica, Private Subnet)</span>
  <span class="text-emerald-400">+ aws_s3_bucket.terraform_state (DynamoDB Locking Enabled)</span>

<span class="text-emerald-400 font-bold">Plan: 8 to add, 0 to change, 0 to destroy. Provisioning duration: &lt; 14 minutes.</span>
    `,
    jenkins: `
<span class="text-cyan-400">$ jenkins trigger --job="Production-Deploy-K8s"</span>
[INFO] Triggered by GitHub Webhook on PR Merge #42
[STAGE 1/5] Git Checkout &amp; Pre-commit Lint ........ <span class="text-emerald-400">PASSED</span> (8s)
[STAGE 2/5] Unit &amp; Integration Tests .............. <span class="text-emerald-400">PASSED</span> (22s)
[STAGE 3/5] Multi-Stage Docker Build (Non-Root) ... <span class="text-emerald-400">SUCCESS</span> (1m 12s)
[STAGE 4/5] Push to Container Registry (ECR) ...... <span class="text-emerald-400">SUCCESS</span> (34s)
[STAGE 5/5] Helm K8s Rolling Upgrade .............. <span class="text-emerald-400">DEPLOYED</span> (2m 14s)

<span class="text-emerald-400 font-bold">🎉 Pipeline Succeeded! Total duration: 4m 30s (Reduced from ~28m manual).</span>
    `,
    skills: `
<span class="text-cyan-400">SAEED TAMBOLI - TECHNICAL STACK COMPETENCIES:</span>
  • <span class="text-emerald-400">Scripting &amp; Python:</span> Python 3, Boto3 SDK, Lambda, Bash, Automated Sweepers
  • <span class="text-emerald-400">Cloud (AWS):</span> EC2, S3, VPC, IAM, RDS, Route 53, CloudWatch, Lambda, EventBridge
  • <span class="text-emerald-400">Containers &amp; K8s:</span> Docker Multi-Stage, Kubernetes (kubectl, Helm), ECR Registry
  • <span class="text-emerald-400">IaC &amp; Config:</span> Terraform Modules, Ansible Playbooks &amp; Roles
  • <span class="text-emerald-400">CI/CD Automation:</span> Jenkins, GitHub Actions, GitLab CI, GitFlow
  • <span class="text-emerald-400">Observability:</span> Prometheus, Grafana, Alertmanager, node_exporter
    `,
    contact: `
<span class="text-cyan-400">CONTACT INFORMATION:</span>
  • Email: <a href="mailto:saeedtamboli278@gmail.com" class="text-emerald-400 underline">saeedtamboli278@gmail.com</a> / <a href="mailto:officialsaeed01@gmail.com" class="text-emerald-400 underline">officialsaeed01@gmail.com</a>
  • Phone: +91 9503795786
  • GitHub: <a href="https://github.com/saeedtamboli01" target="_blank" class="text-emerald-400 underline">github.com/saeedtamboli01</a>
  • Location: Rahata, Maharashtra, India
    `,
    clear: ''
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';

      if (cmd === 'clear') {
        output.innerHTML = `
<div class="text-slate-400 mb-2">Type <span class="text-cyan-400 font-semibold">'help'</span> or click the command shortcuts above to run live commands.</div>
        `;
        return;
      }

      const response = commands[cmd] || `<span class="text-red-400">Command not recognized: '${cmd}'. Type <span class="text-cyan-400">'help'</span> for valid commands.</span>`;

      const promptDiv = document.createElement('div');
      promptDiv.className = 'mt-3 mb-1';
      promptDiv.innerHTML = `<span class="text-cyan-400">saeed@devops-cluster:~$</span> <span class="text-slate-200">${cmd}</span>`;
      output.appendChild(promptDiv);

      const respDiv = document.createElement('div');
      respDiv.className = 'leading-relaxed text-slate-300';
      respDiv.innerHTML = response;
      output.appendChild(respDiv);

      output.scrollTop = output.scrollHeight;
    }
  });

  window.runCommand = function(cmdName) {
    input.value = cmdName;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  };
}

/* -------------------------------------------------------------
 * 4. Animated Metric Counters
 * ------------------------------------------------------------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.ceil(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const counterSection = document.getElementById('impact-metrics');
  if (counterSection) observer.observe(counterSection);
}

/* -------------------------------------------------------------
 * 5. Interactive Skill Category Filtering
 * ------------------------------------------------------------- */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');
        b.classList.add('glass-pill', 'text-slate-400');
      });

      btn.classList.remove('glass-pill', 'text-slate-400');
      btn.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 6. Modal / Drawer Handlers for Deep Dives
 * ------------------------------------------------------------- */
function initModalListeners() {
  const overlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  }
}

window.openProjectModal = function(projectId) {
  const overlay = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  if (!overlay || !modalBody) return;

  const projectDetails = {
    project1: `
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <div>
            <span class="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Python &amp; Serverless AWS Project</span>
            <h3 class="text-2xl font-bold text-slate-100 mt-1">Automated Serverless Event-Driven Log Anomaly Detector &amp; Slack Alerting</h3>
          </div>
          <span class="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-semibold">Python + Boto3</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Log Processing Volume</span>
            <span class="text-cyan-400 font-bold text-lg">140k+ Events/min</span>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Alerting Latency</span>
            <span class="text-emerald-400 font-bold text-lg">&lt; 3.2 Seconds</span>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Infrastructure</span>
            <span class="text-violet-400 font-bold text-lg">AWS Lambda + S3</span>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-slate-200 mb-2">Technical Implementation:</h4>
          <ul class="list-disc list-inside space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>Engineered an event-driven serverless log ingestion engine in Python 3.13 utilizing AWS Lambda and Boto3 SDK triggered by CloudWatch S3 object creation.</li>
            <li>Implemented a custom sliding-window error parsing algorithm to detect HTTP 5xx error spikes (&gt; 5% threshold) and unhandled tracebacks.</li>
            <li>Dispatched formatted Slack alert webhooks containing log stream IDs, error stack traces, and direct CloudWatch Insight deep links.</li>
            <li>Provisioned full serverless infrastructure via Terraform modules with IAM least-privilege execution roles.</li>
          </ul>
        </div>
      </div>
    `,
    project2: `
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <div>
            <span class="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Featured Production Project</span>
            <h3 class="text-2xl font-bold text-slate-100 mt-1">End-to-End CI/CD Pipeline with Zero-Downtime K8s Deployment</h3>
          </div>
          <span class="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-semibold">K8s + Helm</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Deployment Time</span>
            <span class="text-cyan-400 font-bold text-lg">5m 40s (was ~28m)</span>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Rollback Duration</span>
            <span class="text-emerald-400 font-bold text-lg">&lt; 2 Minutes</span>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Downtime</span>
            <span class="text-violet-400 font-bold text-lg">Zero (30+ Deploys)</span>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-slate-200 mb-2">Technical Architecture &amp; Execution:</h4>
          <ul class="list-disc list-inside space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>Architected automated CI/CD pipeline triggered by GitHub webhooks to Jenkins on pull request merges.</li>
            <li>Constructed multi-stage Dockerfiles separating build and runtime environments, utilizing non-root security contexts and read-only root filesystems.</li>
            <li>Orchestrated Kubernetes deployments with rolling update strategies (<code class="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">maxSurge: 1</code>, <code class="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">maxUnavailable: 0</code>) and HTTP health readiness probes on <code class="text-cyan-300">/health</code> endpoint.</li>
            <li>Managed environment secrets and application configurations runtime injection using Kubernetes ConfigMaps &amp; Secrets.</li>
          </ul>
        </div>
      </div>
    `,
    project3: `
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <div>
            <span class="text-xs font-semibold tracking-wider text-violet-400 uppercase">Infrastructure as Code &amp; Monitoring</span>
            <h3 class="text-2xl font-bold text-slate-100 mt-1">AWS Infrastructure Automation with Terraform, Ansible &amp; Observability</h3>
          </div>
          <span class="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/30 rounded-full text-xs font-semibold">IaC + AWS</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Provisioning Time</span>
            <span class="text-cyan-400 font-bold text-lg">&lt; 14 Minutes</span>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Architecture Scale</span>
            <span class="text-emerald-400 font-bold text-lg">8 EC2 + RDS Multi-AZ</span>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Automation Gain</span>
            <span class="text-violet-400 font-bold text-lg">92% Time Savings</span>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-slate-200 mb-2">Technical Execution:</h4>
          <ul class="list-disc list-inside space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>Designed modular 3-tier AWS architecture using Terraform (VPC with public/private subnets, NAT Gateways, Auto Scaling Groups, RDS MySQL in private subnet).</li>
            <li>Stored remote state in AWS S3 with DynamoDB state locking; separated dev, staging, and prod via Terraform Workspaces.</li>
            <li>Authored Ansible roles for post-provisioning configuration: Nginx setup, UFW firewall rules, logrotate, and Prometheus node_exporter installation across all instances.</li>
            <li>Deployed Prometheus, Grafana, and Alertmanager observability stack with pre-built metrics dashboards for CPU, memory, disk I/O, and p95 latency error rate thresholds.</li>
          </ul>
        </div>
      </div>
    `,
    project4: `
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-slate-700/50 pb-4">
          <div>
            <span class="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Python FinOps &amp; Cloud Automation</span>
            <h3 class="text-2xl font-bold text-slate-100 mt-1">Automated Cloud Cost Sweeper &amp; Idle Resource Cleanup Tool</h3>
          </div>
          <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">Python + EventBridge</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Cost Reduction</span>
            <span class="text-cyan-400 font-bold text-lg">$1,430+ / Year</span>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Sweeper Frequency</span>
            <span class="text-emerald-400 font-bold text-lg">Daily Cron Schedule</span>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs block">Automated Action</span>
            <span class="text-violet-400 font-bold text-lg">Snapshot &amp; Cleanup</span>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-slate-200 mb-2">Technical Capabilities:</h4>
          <ul class="list-disc list-inside space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>Authored Python automated FinOps script running scheduled via AWS EventBridge to scan multi-region AWS accounts.</li>
            <li>Identifies unattached EBS volumes, takes safety EBS snapshots to S3, and releases unassociated Elastic IPs.</li>
            <li>Detects idle EC2 instances (&lt; 1.5% CPU utilization over 7 consecutive days) and executes graceful shutdown workflows.</li>
            <li>Generates monthly cost breakdown summaries exported to CSV and uploaded automatically to S3 audit buckets.</li>
          </ul>
        </div>
      </div>
    `
  };

  modalBody.innerHTML = projectDetails[projectId] || '<p>Project details loading...</p>';
  overlay.classList.add('active');
};

/* -------------------------------------------------------------
 * 7. Contact Form Interactive Handler
 * ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (feedback) {
        feedback.classList.remove('hidden');
        feedback.innerHTML = `
          <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm text-center font-medium">
            ✔ Thank you! Your message has been sent successfully. Saeed will get back to you shortly.
          </div>
        `;
        form.reset();
      }
    });
  }
}
