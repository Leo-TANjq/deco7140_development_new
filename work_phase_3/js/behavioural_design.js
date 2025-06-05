import { postFormData } from './modules/postFormData.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('community-form');
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        feedback.style.display = 'block';
        feedback.textContent = 'Submitting...';
        feedback.className = 'form-feedback';

        try {
            const { success, data } = await postFormData(
                form, 
                'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/', 
                {
                    'student_number': 's4896726',
                    'uqcloud_zone_id': '78e5a047'
                }
            );
            if(success){
                success = data.status === 'success';
            }
            if (success) {
                feedback.textContent = data.message || 'Submission successful!';
                feedback.className = 'form-feedback success';
                form.reset();
            } else {
                feedback.textContent = data.message || 'Submission failed. Please check your input.';
                feedback.className = 'form-feedback error';
            }
        } catch (error) {
            console.error('Submission error:', error);
            feedback.textContent = 'Network error. Please try again later.';
            feedback.className = 'form-feedback error';
        }
    });
});