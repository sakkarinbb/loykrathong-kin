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

document.getElementById('launch-button').addEventListener('click', () => {
    const prayerText = document.getElementById('prayer-text').value.trim();
    if (!prayerText) {
        alert("กรุณาพิมพ์คำอธิษฐานก่อนลอยกระทงครับ!");
        return;
    }
    
    // 1. สร้างองค์ประกอบกระทง
    const krathongToFloat = document.createElement('div');
    krathongToFloat.classList.add('floating-krathong');
    
    // 2. ประกอบร่างกระทง
    const krathongImage = document.createElement('div');
    krathongImage.classList.add('krathong-part', currentKrathong.style); 
    krathongToFloat.appendChild(krathongImage);

    const prayerFloat = document.createElement('p');
    prayerFloat.classList.add('prayer-text');
    prayerFloat.textContent = prayerText;
    krathongToFloat.appendChild(prayerFloat);

    // 3. เพิ่มกระทงเข้าสู่แม่น้ำ
    document.getElementById('river-area').appendChild(krathongToFloat);

    // บันทึกกระทงลง LocalStorage
    localStorage.setItem('saved_krathong_style', currentKrathong.style);
    localStorage.setItem('saved_krathong_prayer', prayerText);

    // 4. 🚀 GSAP Timeline (สำหรับกระทงใหม่) 🚀
    
    const randomStartX = Math.random() * 40 + 30; 
    const randomDuration = Math.random() * 15 + 20; 
    const randomDelay = Math.random() * 3; 
    const randomSway = Math.random() * 10 + 5; 
    const randomRotateY = Math.random() * 720 - 360; 
    const randomRotateZ = Math.random() * 10 - 5; 
    const isLTR = Math.random() > 0.5; 
    const randomDriftAmount = Math.random() * 300 + 200; 
    const driftDirection = isLTR ? `+=${randomDriftAmount}` : `-=${randomDriftAmount}`;

    const tl = gsap.timeline({
        delay: randomDelay,
        onComplete: () => {
            krathongToFloat.remove(); 
        }
    });

    // "หย่อน" กระทงลงน้ำ
    tl.fromTo(krathongToFloat, 
        { 
            x: -randomSway / 2, left: `${randomStartX}%`, bottom: 10, 
            opacity: 0, scale: 1.1, 
            rotationY: 0, 
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
        bottom: "60%", 
        scale: 0.1,    
        x: driftDirection, 
        rotationY: randomRotateY, 
        duration: randomDuration,
        ease: "power1.in"
    }, "<"); 

    // "จางหาย" ไปเมื่อลอยไกล
    tl.to(krathongToFloat, {
        opacity: 0, 
        duration: randomDuration * 0.5, 
        ease: "power1.in"
    }, randomDuration * 0.5); 

    // "โคลงเคลง" ซ้ายขวา
    tl.to(krathongToFloat, {
        x: `+=${randomSway}`, 
        rotationZ: `-${randomRotateZ + 5}`, 
        repeat: -1, yoyo: true, duration: 4.5, ease: "sine.inOut"
    }, "<"); 

    // "ลอยขึ้นลง" เบาๆ (Bobbing)
    tl.to(krathongToFloat, {
        y: "+=5", 
        repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut"
    }, "<1"); 
});

// --- (ใหม่) ฟังก์ชันสำหรับสร้างกระทงที่ "บันทึกไว้" (⬇️⬇️⬇️ แก้ไข ⬇️⬇️⬇️) ---
function createSavedKrathong(style, prayer) {
    // 1. สร้างองค์ประกอบกระทง
    const krathongToFloat = document.createElement('div');
    krathongToFloat.classList.add('floating-krathong');

    // 2. ประกอบร่าง
    const krathongImage = document.createElement('div');
    krathongImage.classList.add('krathong-part', style);
    krathongToFloat.appendChild(krathongImage);

    const prayerFloat = document.createElement('p');
    prayerFloat.classList.add('prayer-text');
    prayerFloat.textContent = prayer;
    krathongToFloat.appendChild(prayerFloat);

    // 3. เพิ่มกระทงเข้าสู่แม่น้ำ
    document.getElementById('river-area').appendChild(krathongToFloat);

    // 4. 🚀 GSAP "set" ให้อยู่ในตำแหน่งที่ลอยไปแล้ว
    gsap.set(krathongToFloat, {
        left: `${Math.random() * 40 + 30}%`, 
        bottom: `${Math.random() * 20 + 30}%`, 
        scale: 0.5,    // ขนาดเริ่มต้น (ใหญ่)
        opacity: 0.8,  // ความชัดเริ่มต้น (ชัด)
        rotationY: Math.random() * 360, 
        rotationZ: Math.random() * 10 - 5 
    });

    // 5. 🚀 (ใหม่!) สร้าง Timeline ให้กระทงเก่า "ลอยต่อ" 🚀
    const randomDuration = Math.random() * 10 + 15; // ลอยต่อ 15-25 วินาที
    const randomSway = Math.random() * 5 + 5;
    const randomRotateZ = Math.random() * 5 + 3;
    const isLTR = Math.random() > 0.5;
    const randomDriftAmount = Math.random() * 100 + 50; // ลอยไปอีกหน่อย
    const driftDirection = isLTR ? `+=${randomDriftAmount}` : `-=${randomDriftAmount}`;

    const savedTl = gsap.timeline({
        delay: Math.random() * 2, // เริ่มลอยต่อแบบสุ่มดีเลย์
        onComplete: () => {
            krathongToFloat.remove(); // ลบออกเมื่อลอยจบ
        }
    });

    // "ลอยต่อ" (ย่อส่วนและจางหาย)
    savedTl.to(krathongToFloat, {
        bottom: "60%", // ลอยขึ้นไปอีกหน่อย
        scale: 0.1,    // ย่อส่วนจนเล็ก
        opacity: 0,    // จางหายไป
        x: driftDirection, // ลอยไปด้านข้าง
        duration: randomDuration,
        ease: "power1.in"
    });

    // "โคลงเคลง" ซ้ายขวา
    savedTl.to(krathongToFloat, {
        x: `+=${randomSway}`,
        rotationZ: `-${randomRotateZ}`,
        repeat: -1, yoyo: true, duration: 4.5, ease: "sine.inOut"
    }, "<");

    // "ลอยขึ้นลง" เบาๆ (Bobbing)
    savedTl.to(krathongToFloat, {
        y: "+=5",
        repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut"
    }, "<");
}

// --- (ใหม่) ฟังก์ชันสำหรับโหลดกระทงที่บันทึกไว้ (ทำงานตอนเปิดเว็บ) ---
function loadSavedKrathong() {
    const savedStyle = localStorage.getItem('saved_krathong_style');
    const savedPrayer = localStorage.getItem('saved_krathong_prayer');

    if (savedStyle && savedPrayer) {
        createSavedKrathong(savedStyle, savedPrayer);
        
        currentKrathong.style = savedStyle;
        document.getElementById('prayer-text').value = savedPrayer;
        
        document.querySelectorAll('.select-btn').forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`.select-btn[data-image="${savedStyle}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
}

// --- 3. เรียกใช้ครั้งแรกเมื่อโหลดหน้าเว็บ ---
const initialButton = document.querySelector(`.select-btn[data-image="${currentKrathong.style}"]`);
if (initialButton) {
    initialButton.classList.add('active');
}
updateKrathongPreview();

// เรียกใช้ฟังก์ชันโหลดกระทงที่บันทึกไว้
loadSavedKrathong();