// ============================================================
// Trial Module - إدارة التجارب المجانية
// ============================================================

const Trial = (() => {
    const DEFAULT_DURATION = 10 * 60; // 10 دقائق بالثواني

    // بدء تجربة جديدة
    function startTrial(courseId, durationSeconds = DEFAULT_DURATION) {
        const now = Date.now();
        const data = {
            startTimestamp: now,
            duration: durationSeconds,
            expiresAt: now + (durationSeconds * 1000),
            courseId: courseId,
            active: true
        };
        Storage.setTrialData(courseId, data);
        return data;
    }

    // الحصول على حالة التجربة
    function getTrialStatus(courseId) {
        const data = Storage.getTrialData(courseId);
        if (!data || !data.active) {
            return { active: false, remaining: 0, expired: true };
        }

        const now = Date.now();
        const remainingMs = data.expiresAt - now;
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
        const expired = remainingSeconds <= 0;

        if (expired) {
            // انتهت التجربة
            data.active = false;
            Storage.setTrialData(courseId, data);
            return { active: false, remaining: 0, expired: true };
        }

        return {
            active: true,
            remaining: remainingSeconds,
            expired: false,
            data: data
        };
    }

    // إنهاء التجربة يدوياً
    function endTrial(courseId) {
        Storage.removeTrialData(courseId);
    }

    // التحقق من وجود تجربة نشطة
    function hasActiveTrial(courseId) {
        const status = getTrialStatus(courseId);
        return status.active && !status.expired;
    }

    // الحصول على الوقت المتبقي بصيغة readable
    function formatRemaining(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // تحديث عداد التجربة في واجهة المستخدم
    function updateTrialUI(courseId, elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const status = getTrialStatus(courseId);
        if (!status.active || status.expired) {
            el.textContent = 'انتهت التجربة';
            el.classList.add('expired');
            return;
        }

        el.textContent = `⏱ متبقي: ${formatRemaining(status.remaining)}`;
        el.classList.remove('expired');

        // تحديث كل ثانية
        if (status.active && !status.expired) {
            setTimeout(() => updateTrialUI(courseId, elementId), 1000);
        }
    }

    // واجهة عامة
    return {
        startTrial,
        getTrialStatus,
        endTrial,
        hasActiveTrial,
        formatRemaining,
        updateTrialUI,
        DEFAULT_DURATION
    };
})();

window.Trial = Trial;