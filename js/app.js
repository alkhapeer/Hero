submitBtn.addEventListener('click', () => {
    const code = input.value.trim();
    const courseId = parseInt(modal.dataset.courseId);
    if (!courseId) {
        msg.textContent = 'معرف الدورة غير موجود.';
        return;
    }
    if (!code) {
        msg.textContent = 'الرجاء إدخال كود التفعيل.';
        return;
    }

    // حفظ الكود بدون تحقق
    const result = Activation.activateCourse(courseId, code);
    if (result.success) {
        msg.style.color = '#16a34a';
        msg.textContent = result.message;
        setTimeout(() => {
            hideActivationModal();
            // إعادة تحميل المحتوى بعد التفعيل
            startApp(courseId);
        }, 1500);
    } else {
        msg.style.color = '#b00020';
        msg.textContent = result.message;
    }
});