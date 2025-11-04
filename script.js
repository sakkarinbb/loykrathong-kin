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

    // 4. 🚀 GSAP Timeline (อนิเมชั่นลอยแบบ 3D) 🚀
    
    const randomStartX = Math.random() * 40 + 30; // ตำแหน่งเริ่มสุ่ม
    const randomDuration = Math.random() * 15 + 20; // ระยะเวลาลอยสุ่ม
    const randomDelay = Math.random() * 3; // หน่วงเวลาก่อนลอยสุ่ม
    const randomSway = Math.random() * 10 + 5; // โคลงเคลงซ้ายขวาสุ่ม
    const randomRotateY = Math.random() * 720 - 360; // หมุนรอบแกน Y สุ่ม 1-2 รอบ
    const randomRotateZ = Math.random() * 10 - 5; // เอียงเล็กน้อยสุ่ม
    const isLTR = Math.random() > 0.5; // ลอยซ้ายหรือขวาสุ่ม
    const randomDriftAmount = Math.random() * 300 + 200; // ระยะลอยตามแนวนอนสุ่ม
    const driftDirection = isLTR ? `+=${randomDriftAmount}` : `-=${randomDriftAmount}`;

    const tl = gsap.timeline({
        delay: randomDelay,
        onComplete: () => {
            krathongToFloat.remove(); // ลบกระทงออกจาก DOM เมื่อลอยไปสุด
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
        bottom: "60%", // ลอยขึ้นไปตามสายตา
        scale: 0.1,    // เล็กลงเมื่อลอยไกล
        x: driftDirection, // ลอยตามแนวนอน
        rotationY: randomRotateY, // หมุนแบบ 3D
        duration: randomDuration,
        ease: "power1.in"
    }, "<"); // เริ่มพร้อมกับอนิเมชั่นที่แล้ว

    // "จางหาย" ไปเมื่อลอยไกล
    tl.to(krathongToFloat, {
        opacity: 0, 
        duration: randomDuration * 0.5, 
        ease: "power1.in"
    }, randomDuration * 0.5); // เริ่มจางหายตอนครึ่งทางของอนิเมชั่นลอย

    // "โคลงเคลง" ซ้ายขวา
    tl.to(krathongToFloat, {
        x: `+=${randomSway}`, 
        rotationZ: `-${randomRotateZ + 5}`, 
        repeat: -1, yoyo: true, duration: 4.5, ease: "sine.inOut"
    }, "<"); // เริ่มพร้อมกับอนิเมชั่นลอย

    // "ลอยขึ้นลง" เบาๆ (Bobbing)
    tl.to(krathongToFloat, {
        y: "+=5", 
        repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut"
    }, "<1"); // เริ่มหลังจากอนิเมชั่นลอยไป 1 วินาที
});

// --- 3. เรียกใช้ครั้งแรกเมื่อโหลดหน้าเว็บ ---
document.querySelector(`.select-btn[data-image="${currentKrathong.style}"]`).classList.add('active');

updateKrathongPreview();