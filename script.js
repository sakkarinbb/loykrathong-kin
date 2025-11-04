// --- 1. ส่วนควบคุมการสร้างกระทง ---

let currentKrathong = {
    style: 'k1', // ค่าเริ่มต้น
    prayer: ''
};

// อัปเดตภาพกระทงตัวอย่าง (เพิ่ม 3D Spin)
function updateKrathongPreview() {
    const previewEl = document.getElementById('krathong-preview-image');
    previewEl.className = 'krathong-part'; 
    previewEl.classList.add(currentKrathong.style); 
    
    gsap.killTweensOf(previewEl); // เคลียร์อนิเมชั่นเก่า (ถ้ามี)
    gsap.to(previewEl, { 
        rotationY: "+=360", 
        duration: 10, 
        repeat: -1, 
        ease: "linear" 
    });
}

// เมื่อคลิกปุ่มเลือก "แบบ" กระทง
document.querySelectorAll('.select-btn').forEach(button => {
    button.addEventListener('click', function() {
        const image = this.getAttribute('data-image');
        
        currentKrathong.style = image;

        document.querySelectorAll('.select-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        updateKrathongPreview();
    });
});


// --- 2. ส่วนควบคุมการลอยกระทง (GSAP) ---

// (ฟังก์ชันกลางสำหรับสร้างอนิเมชั่นลอยกระทง)
function launchKrathongAnimation(style, prayer, isAmbient) {
    const krathongToFloat = document.createElement('div');
    krathongToFloat.classList.add('floating-krathong');
    
    const krathongImage = document.createElement('div');
    krathongImage.classList.add('krathong-part', style); 
    krathongToFloat.appendChild(krathongImage);

    if (prayer) {
        const prayerFloat = document.createElement('p');
        prayerFloat.classList.add('prayer-text');
        prayerFloat.textContent = prayer;
        krathongToFloat.appendChild(prayerFloat);
    }

    document.getElementById('river-area').appendChild(krathongToFloat);

    // 4. 🚀 GSAP Timeline (ลอยแนวนอน, ไม่หมุน) 🚀
    
    const randomDuration = Math.random() * 20 + 30; // 30-50 วินาที
    const randomDelay = isAmbient ? Math.random() * 10 : Math.random() * 1; 
    const randomSway = Math.random() * 10 + 5; 
    const randomRotateZ = Math.random() * 10 - 5; 
    const isLTR = Math.random() > 0.5; 

    let startX, endX;

    if (isAmbient) {
        // กระทงสุ่ม (เริ่มกลางจอ)
        startX = `${Math.random() * 40 + 30}%`;
        endX = isLTR ? "+=100vw" : "-=100vw";
    } else {
        // กระทงของเรา (เริ่มริมจอ)
        if (isLTR) {
            startX = "-10%"; 
            endX = "110vw"; 
        } else {
            startX = "110%"; 
            endX = "-110vw"; 
        }
    }

    const tl = gsap.timeline({
        delay: randomDelay,
        onComplete: () => {
            krathongToFloat.remove(); 
        }
    });

    // "หย่อน" กระทงลงน้ำ
    tl.fromTo(krathongToFloat, 
        { 
            x: -randomSway / 2, left: startX, bottom: 10, 
            opacity: 0, scale: 1.1, 
            rotationZ: randomRotateZ 
        },
        { 
            x: 0, bottom: 0, opacity: 1, scale: 1,
            rotationZ: 0,
            duration: 2, ease: "back.out(1.7)"
        }
    ); 

    // "ลอย" ไปตามแม่น้ำ
    tl.to(krathongToFloat, {
        scale: 0.8,    
        x: endX, 
        duration: randomDuration,
        ease: "linear" 
    }, "<"); 

    // "จางหาย"
    tl.to(krathongToFloat, {
        opacity: 0, 
        duration: randomDuration * 0.3, 
        ease: "power1.in"
    }, randomDuration * 0.7); 

    // "โคลงเคลง"
    tl.to(krathongToFloat, {
        x: `+=${randomSway}`, 
        rotationZ: `-${randomRotateZ + 5}`, 
        repeat: -1, yoyo: true, duration: 4.5, ease: "sine.inOut"
    }, "<"); 

    // "ลอยขึ้นลง"
    tl.to(krathongToFloat, {
        y: "+=10", 
        repeat: -1, yoyo: true, duration: 2.5,
        ease: "sine.inOut"
    }, "<1"); 
}


// เมื่อกดปุ่ม "ลอยกระทง"
document.getElementById('launch-button').addEventListener('click', () => {
    const prayerText = document.getElementById('prayer-text').value.trim();
    if (!prayerText) {
        alert("กรุณาพิมพ์คำอธิษฐานก่อนลอยกระทงครับ!");
        return;
    }
    launchKrathongAnimation(currentKrathong.style, prayerText, false);
});

// ฟังก์ชันสร้างกระทงสุ่ม (Ambient)
function createAmbientKrathongs() {
    const styles = ['k1', 'k2', 'k3', 'k4', 'k5']; 
    const numKrathongs = 3; 
    for (let i = 0; i < numKrathongs; i++) {
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        launchKrathongAnimation(randomStyle, "", true); 
    }
}


// --- 3. เรียกใช้ครั้งแรกเมื่อโหลดหน้าเว็บ ---
const initialButton = document.querySelector(`.select-btn[data-image="${currentKrathong.style}"]`);
if (initialButton) {
    initialButton.classList.add('active');
}
updateKrathongPreview();
createAmbientKrathongs(); // สร้างกระทง "สุ่ม" 3 อัน


/* --- (ใหม่) 4. ส่วนควบคุมพลุ --- */

const fireworksContainer = document.getElementById('fireworks-container');
const fireworkColors = ['#FFD700', '#FF4500', '#FF69B4', '#ADFF2F', '#1E90FF', '#FFFFFF'];

// ฟังก์ชันสร้างพลุ 1 ลูก
function createFirework() {
    const numParticles = 30; 
    
    const x = Math.random() * 80 + 10; 
    const y = Math.random() * 60 + 20; 

    const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('firework-particle');
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.backgroundColor = color;

        const angle = Math.random() * 360; 
        const force = Math.random() * 100 + 50; 
        
        const targetX = Math.cos(angle * (Math.PI / 180)) * force;
        const targetY = Math.sin(angle * (Math.PI / 180)) * force;

        particle.style.setProperty('--x', `${targetX}px`);
        particle.style.setProperty('--y', `${targetY}px`);

        fireworksContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1200); 
    }
}

// ฟังก์ชันสำหรับเริ่มยิงพลุแบบสุ่มเวลา
function startFireworks() {
    createFirework(); 
    
    setTimeout(startFireworks, Math.random() * 3000 + 2000); 
}

// เริ่มยิงพลุ
startFireworks();