// ============================================================
// Storage Module - LocalStorage & IndexedDB wrapper
// ============================================================

const Storage = (() => {
    // ===== LocalStorage =====
    function set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    }

    function get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    }

    function remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }

    // ===== متخصصة للدورات المفعلة =====
    function getActivatedCourses() {
        return get('hero_activated_courses', {});
    }

    function setActivatedCourses(data) {
        return set('hero_activated_courses', data);
    }

    function addActivatedCourse(courseId, activationData) {
        const courses = getActivatedCourses();
        courses[courseId] = {
            activatedAt: Date.now(),
            ...activationData
        };
        return setActivatedCourses(courses);
    }

    function isCourseActivated(courseId) {
        const courses = getActivatedCourses();
        return !!courses[courseId];
    }

    function getCourseActivation(courseId) {
        const courses = getActivatedCourses();
        return courses[courseId] || null;
    }

    // ===== بيانات التجربة =====
    function getTrialData(courseId) {
        const key = `hero_trial_${courseId}`;
        return get(key, null);
    }

    function setTrialData(courseId, data) {
        const key = `hero_trial_${courseId}`;
        return set(key, data);
    }

    function removeTrialData(courseId) {
        const key = `hero_trial_${courseId}`;
        return remove(key);
    }

    // ===== إعدادات المستخدم =====
    function getSettings() {
        return get('hero_settings', { theme: 'light' });
    }

    function setSettings(settings) {
        return set('hero_settings', settings);
    }

    // ===== API عام =====
    return {
        set,
        get,
        remove,
        getActivatedCourses,
        setActivatedCourses,
        addActivatedCourse,
        isCourseActivated,
        getCourseActivation,
        getTrialData,
        setTrialData,
        removeTrialData,
        getSettings,
        setSettings
    };
})();

// تصدير للاستخدام العام
window.Storage = Storage;