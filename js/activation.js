// ============================================================
// Activation Module – تخزين كود التفعيل محلياً فقط
// ============================================================

const Activation = {
    // تفعيل الدورة بتخزين الكود (بدون أي تحقق)
    activateCourse(courseId, activationCode) {
        // نحفظ الكود كما هو، ولو كان فارغاً نرفض
        if (!activationCode || activationCode.trim() === '') {
            return { success: false, message: 'الرجاء إدخال كود التفعيل.' };
        }

        const saved = Storage.addActivatedCourse(courseId, {
            activationCode: activationCode.trim(),
            activatedAt: Date.now()
        });

        if (saved) {
            // إلغاء أي تجربة لهذه الدورة
            Trial.endTrial(courseId);
            return { success: true, message: 'تم تفعيل الدورة بنجاح!' };
        }
        return { success: false, message: 'حدث خطأ أثناء حفظ التفعيل.' };
    },

    // التحقق من التفعيل (يعتمد على وجود الكود المخزن)
    isActivated(courseId) {
        return Storage.isCourseActivated(courseId);
    },

    getActivationData(courseId) {
        return Storage.getCourseActivation(courseId);
    },

    deactivateCourse(courseId) {
        const courses = Storage.getActivatedCourses();
        delete courses[courseId];
        return Storage.setActivatedCourses(courses);
    }
};

window.Activation = Activation;