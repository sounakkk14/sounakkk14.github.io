/* ============================================================
   content.js  —  THE ONLY FILE YOU NORMALLY EDIT
   ------------------------------------------------------------
   Everything on the site is rendered from this object. To add a
   project, append one { } block to projects. Nothing else to
   touch. Leave any field as "" and it simply does not render.
   ============================================================ */

window.CONTENT = {

  /* ---------- 1. WHO YOU ARE (header + footer) ---------- */
  profile: {
    name: "Sounak Chakraborty",
    initials: "SC",                 // shown if photo is ""
    photo: "",                      // e.g. "assets/photo.jpg" -> replaces the initials circle
    role: "Electronics & Communication Engineering",
    focus: "Radar signal processing · Embedded systems · Digital VLSI",
    status: "3rd year B.Tech · open to internships and 2028 graduate roles",
    location: "Kattankulathur, Chennai, India",
    headline: "I build the signal chain end to end — from raw radar ADC samples to confirmed detections, and from Verilog RTL down to GDSII.",
    contact: {
      email: "chakrabortysounak78@gmail.com",
      phone: "",                    // deliberately blank: not on a public page
      linkedin: "linkedin.com/in/sounakkchakraborty",
      github: "github.com/sounakkk14"
    },
    // Blank: the PDF is kept out of the public repo, so no download button.
    // Put the path back here if you ever host the PDF again.
    resume: ""
  },

  /* ---------- 2. ABOUT ME (one string per paragraph) ---------- */
  about: [
    "I am a third-year Electronics and Communication Engineering student at SRM Institute of Science and Technology, and I work at the point where signal processing meets real hardware. Right now I am an RF/Radar intern at Griffin AI Tech, building the processing chain for a 60 GHz FMCW radar that detects when a person falls: range FFT, Doppler FFT, clutter removal, CFAR detection and angle-of-arrival estimation, working from the raw ADC output of an Infineon BGT60TR13C board rather than a vendor's pre-processed point cloud.",
    "That preference for working one level below the abstraction runs through everything I do. When a detector has to run on a device instead of in a notebook, I write it in synthesizable Verilog and verify it bit for bit against an integer-only golden model: my CA-CFAR detector passes 98,330 output checks with zero mismatches and closes at 72.1 MHz on a Spartan-3E. When I wanted to know what fault tolerance actually costs in silicon, I took an 8-bit ALU through the full RTL-to-GDSII flow twice, plain and triple-modular-redundant, on SKY130 with OpenROAD, and measured the penalty: 2.65x area, 23% lower Fmax, 2.17x power.",
    "Alongside the hardware I keep a working range in firmware and applied machine learning: STM32 firmware for a 2S Li-ion battery management system with real protection state machines, a YOLO-based PCB defect inspection pipeline reaching 98.8% mAP@50 across six defect classes, and a variable step-size LMS adaptive filter for ECG denoising that is deployed and live. I like problems where the measurement is the answer, and I am looking for internship and graduate work in radar, embedded systems or digital design."
  ],

  /* ---------- 3. EDUCATION ---------- */
  education: {
    degree: "B.Tech, Electronics and Communication Engineering",
    institute: "SRM Institute of Science and Technology",
    period: "2024 – 2028 (expected)",
    location: "Kattankulathur, Chennai",
    year: "3rd year",
    cgpa: "",                       // add your CGPA, e.g. "8.74 / 10" -> it appears automatically
    coursework: [
      "Digital Electronics", "Circuit Analysis & Design", "Signal Processing",
      "VLSI Design", "Microprocessors & Microcontrollers",
      "Embedded Systems", "Communication Systems"
    ]
  },

  /* ---------- 4. EXPERIENCE ---------- */
  experience: [
    {
      role: "RF / Radar Intern",
      org: "Griffin AI Tech",
      period: "2026 – present",
      meta: "Hybrid",
      bullets: [
        "Developing the signal-processing chain for a 60 GHz FMCW radar system that detects human falls: range FFT, Doppler FFT, clutter removal, CFAR detection and angle-of-arrival estimation.",
        "Working with raw radar data from an Infineon BGT60TR13C demo board for human-target isolation and point-cloud generation.",
        "Compared Infineon and TI mmWave platforms, raw ADC output versus processed point clouds, to support sensor selection."
      ],
      tags: ["FMCW", "Range-Doppler", "CFAR", "AoA", "Python", "BGT60TR13C"]
    },
    {
      role: "Electronics Engineering Intern",
      org: "Eastern Coalfields Limited (ECL), Government of India",
      period: "Summer 2026",
      meta: "On-site",
      bullets: [
        "Analyzed the AI video analytics pipeline at the Integrated Command and Control Centre: IP cameras, H.265 streaming, GPU-based CNN inference and real-time alert generation.",
        "Evaluated YOLO-based object and PPE detection with TensorRT INT8 optimization for accuracy, latency and throughput on multi-camera workloads.",
        "Studied the supporting infrastructure (VMS, MPLS-VPN networking, RAID storage, GPS vehicle tracking) and proposed edge-AI deployment with adaptive video streaming."
      ],
      tags: ["YOLO", "TensorRT", "H.265", "Edge AI", "ICCC"]
    }
  ],

  /* ---------- 5. PROJECTS ----------
     To add one, copy a block and change the fields.
     metrics = the numbers recruiters scan; keep them real.
     links   = [] when there is nothing public to link yet.     */
  projects: [
    {
      name: "FPGA-Ready CA-CFAR Detector",
      stack: "Verilog-2001 · Xilinx ISE · Python golden model",
      period: "2026",
      status: "",
      blurb: "A streaming 1D cell-averaging CFAR detector in plain synthesizable Verilog, verified bit for bit against an integer-only Python golden model and synthesized for a Spartan-3E FPGA. The adaptive threshold tracks local noise, so a loud clutter region does not produce false alarms and a quiet region does not hide weak targets.",
      bullets: [
        "21-cell sliding window: one cell under test, 2 guard cells and 8 training cells per side, threshold scale alpha = 8.0 in 4-bit fixed point.",
        "Division eliminated by rewriting the threshold test as an integer comparison, so the whole decision costs one 28-bit comparator.",
        "Self-checking testbench across 6 random seeds; 5 of 5 deliberately injected RTL bugs were caught by the suite."
      ],
      metrics: [
        ["Verification", "20 tests · 98,330 checks · 0 mismatches"],
        ["Bug-injection check", "5 of 5 caught"],
        ["Fmax (XC3S500E-4FG320)", "72.1 MHz"],
        ["Resources", "413 FF · 104 LUT (~5% of device)"],
        ["Throughput / latency", "1 sample per clock / 2 cycles"]
      ],
      tags: ["Verilog", "CFAR", "FPGA", "Verification", "Fixed-point"],
      links: [["Source on GitHub", "https://github.com/sounakkk14/cfar-detector-verilog"]]
    },
    {
      name: "TMR ALU, RTL to GDSII",
      stack: "Verilog · OpenROAD-flow-scripts · SKY130HD · Yosys · KLayout",
      period: "2026",
      status: "",
      blurb: "What does fault tolerance actually cost in silicon? I took the same 8-bit ALU through the full open-source RTL-to-GDSII flow twice, once plain and once triple-modular-redundant with a majority voter and per-copy error flags, and measured the difference at matched constraints.",
      bullets: [
        "Both designs reached GDS at a 5.0 ns clock with zero detailed-route DRC violations, zero antenna violations, setup and hold met, and logic equivalence confirmed against the synthesized netlist.",
        "Used keep_hierarchy so Yosys could not merge the three identical ALU copies; the synthesized netlist is verified to still contain 3 alu8 instances.",
        "Area grows 2.65x rather than 3x because the input flip-flops and clock tree are shared: combinational cells grow 3.42x while flip-flops grow only 1.09x."
      ],
      metrics: [
        ["Std-cell area", "3,719.8 → 9,858.2 µm² (2.65x)"],
        ["Fmax", "284.3 → 218.6 MHz (0.77x)"],
        ["Total power @ 200 MHz", "0.794 → 1.725 mW (2.17x)"],
        ["Logic cells", "407 → 1,293 (3.18x)"],
        ["DRC / antenna violations", "0 / 0 in both runs"]
      ],
      tags: ["VLSI", "OpenROAD", "SKY130", "TMR", "Physical design", "PPA"],
      links: []
    },
    {
      name: "AI PCB Defect Inspection",
      stack: "Python · OpenCV · YOLO · PyTorch · CUDA",
      period: "2026",
      status: "",
      blurb: "An end-to-end computer-vision pipeline that detects and localizes six classes of PCB manufacturing defect, built from dataset validation through to automated inference with confidence estimation.",
      bullets: [
        "Wrote dataset-validation and annotation-processing scripts and corrected 2,667 image-label mismatches before any training run.",
        "Trained YOLO26n on 8,534 PCB images and evaluated on 1,068 held-out images containing 2,158 defect instances.",
        "Automated inference for defect localization, classification, bounding-box generation and confidence estimation."
      ],
      metrics: [
        ["Precision", "96.7%"],
        ["Recall", "97.2%"],
        ["mAP@50", "98.8%"],
        ["mAP@50-95", "57.6%"],
        ["Defect classes", "6"]
      ],
      tags: ["YOLO", "PyTorch", "OpenCV", "CUDA", "Object detection"],
      links: []
    },
    {
      name: "2S Li-ion Battery Management System",
      stack: "STM32F411 (ARM Cortex-M4) · Embedded C · I2C · ADC · UART",
      period: "Ongoing",
      status: "ongoing",
      blurb: "A BMS in bare-metal STM32 firmware that monitors a 2-series Li-ion pack and actually cuts it off when something goes wrong, rather than only logging that it did.",
      bullets: [
        "Monitors cell voltage, pack current and temperature using an INA219 I2C current sensor, resistor dividers and an NTC thermistor.",
        "Estimates state of charge with a voltage lookup table combined with coulomb counting; passive cell balancing through MOSFET-switched bleed resistors with optocoupler isolation.",
        "State-machine firmware covering over-voltage, under-voltage, over-current and over-temperature faults, with relay cut-off and UART logging to a Python host."
      ],
      metrics: [
        ["Pack configuration", "2S Li-ion"],
        ["MCU", "STM32F411, ARM Cortex-M4"],
        ["Protection faults", "OV · UV · OC · OT"],
        ["SoC method", "Voltage LUT + coulomb counting"]
      ],
      tags: ["STM32", "Embedded C", "I2C", "Power electronics", "Firmware"],
      links: []
    },
    {
      name: "Adaptive Noise Cancellation for ECG",
      stack: "Python · NumPy · SciPy · Streamlit",
      period: "2026",
      status: "",
      blurb: "A variable step-size LMS adaptive filter that strips power-line and muscle noise out of ECG recordings, with automatic FFT-based interference detection so the filter does not have to be told what to remove. Deployed and live.",
      bullets: [
        "Implemented VSLMS with NLMS normalization, extending an earlier fixed Butterworth and notch-filter version to handle drifting interference.",
        "Automatic FFT-based detection identifies the interfering band before adaptation begins.",
        "Tested on synthetic and real ECG signals with 50 Hz power-line noise, EMG noise and baseline wander; shipped as a Streamlit web app."
      ],
      metrics: [
        ["Algorithms", "VSLMS + NLMS"],
        ["Noise handled", "50 Hz line · EMG · baseline wander"],
        ["Deployment", "Live Streamlit app"]
      ],
      tags: ["Adaptive filtering", "LMS/NLMS", "DSP", "Streamlit", "Biomedical"],
      links: [["Live app", "https://sounak-vslms.streamlit.app"]]
    }
  ],

  /* ---------- 6. SKILLS ---------- */
  skills: [
    { group: "Programming",              items: ["Python", "C", "Embedded C", "Verilog"] },
    { group: "Embedded & hardware",      items: ["STM32 (ARM Cortex-M4)", "Raspberry Pi", "I2C / UART / ADC", "PCB design & debugging", "Circuit simulation"] },
    { group: "Radar & signal processing", items: ["FMCW radar", "Range-Doppler processing", "CFAR", "FFT", "FIR / IIR filters", "Adaptive filtering (LMS / NLMS)"] },
    { group: "AI & computer vision",     items: ["YOLO", "OpenCV", "PyTorch", "CUDA", "Machine learning", "Agentic AI"] },
    { group: "Tools & libraries",        items: ["NumPy", "SciPy", "Matplotlib", "Pandas", "Streamlit", "ModelSim", "Xilinx ISE", "OpenROAD", "Git"] }
  ],

  /* ---------- 7. ACHIEVEMENTS ----------
     Add awards, hackathon placings, ranks, scholarships, papers.
     Shape: { title, body, meta }   (meta is optional)
     While this list is empty you get a reminder card on LOCAL
     preview only; published visitors never see it.             */
  achievements: [],

  /* ---------- 8. CERTIFICATIONS ---------- */
  certifications: [
    { title: "ARM Cortex Processors", issuer: "Pantech Labs", meta: "" },
    { title: "Oracle Agentic AI Foundation", issuer: "Oracle", meta: "Proctored exam" }
  ]
};
