import { getAccount } from "./account.js";
export function initForm(identifier = "") {
    const postFormData = async (formData, endpointUrl, customHeaders = {}) => {
        try {
            const response = await fetch(endpointUrl, {
                method: "POST",
                headers: customHeaders,
                body: formData,
            });

            const data = await response.json();
            return {
                success: response.ok,
                data,
            };
        } catch (error) {
            return {
                success: false,
                data: { message: "Network or server error.", error },
            };
        }
    };

    const form = document.getElementById("community-form");
    const feedback = document.getElementById("form-feedback");
    const fileUploadArea = document.getElementById("file-upload-area");
    const imagePreview = document.getElementById("image-preview");
    const fileInput = document.getElementById("file-input");
    const submitButton = form.querySelector('button[type="submit"]');
    fileInput.type = "file";
    fileInput.accept = "image/png, image/jpeg, image/gif";
    fileInput.style.display = "none";

    fileUploadArea.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    fileUploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        fileUploadArea.style.border = "2px dashed #007BFF";
    });

    fileUploadArea.addEventListener("dragleave", () => {
        fileUploadArea.style.border = "none";
    });

    fileUploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        fileUploadArea.style.border = "none";
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
            };
            reader.readAsDataURL(file);
            fileInput.files = e.dataTransfer.files;
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 显示反馈信息并禁用提交按钮
        feedback.style.display = "block";
        feedback.textContent = "Submitting...";
        feedback.className = "form-feedback";
        submitButton.disabled = true;

        try {
            // Add identifier to email if provided
            const formData = new FormData(form);
            if (identifier) {
                const email = formData.get("email");
                formData.set("email", `$%$${identifier}${email}`);
            }

            const { success, data } = await postFormData(
                formData,
                "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/",
                {
                    student_number: "s4896726",
                    uqcloud_zone_id: "78e5a047",
                }
            );

            if (success && data.status === "success") {
                feedback.textContent = data.message || "Submission successful!";
                feedback.className = "form-feedback success";
                form.reset();

                await getAccount(identifier);

                // 1秒后关闭注册表单
                setTimeout(() => {
                    const sidebar = document.getElementById("sidebar");
                    const viewAccount = document.querySelector(".view-account");
                    const toggleButton =
                        document.getElementById("sidebar-toggle");
                    const desktopCloseViewer = document.querySelector(
                        ".desktop-close-viewer"
                    );
                    const mobileCloseViewer = document.getElementById(
                        "mobile-close-viewer"
                    );

                    viewAccount.style.display = "block";
                    toggleButton.style.display = "flex";
                    sidebar.classList.remove("show-form");
                    desktopCloseViewer.style.display = "none";
                    mobileCloseViewer.style.display = "none";
                }, 1000);
            } else {
                feedback.textContent =
                    data.message ||
                    "Submission failed. Please check your input.";
                feedback.className = "form-feedback error";
            }
        } catch (error) {
            console.error("Submission error:", error);
            feedback.textContent = "Network error. Please try again later.";
            feedback.className = "form-feedback error";
        } finally {
            // 恢复提交按钮状态
            submitButton.disabled = false;
        }
    });
}
