import { getAccount } from "./account.js";
import { postFormData } from "./postFormData.js";
function formatDateTime(date) {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(date).toLocaleString("en-US", options);
}

export function initTopic() {
    const topicPanels = document.querySelectorAll(
        ".panel.topic, .panel[data-topic-id]"
    );
    const topic = document.getElementById("topicViewer");
    const topicContent = document.getElementById("topicContent");
    const closeViewerBtnD = document.querySelectorAll(".desktop-close-viewer");
    const closeViewerBtnM = document.getElementById("mobile-close-viewer");

    const floatingButton = document.getElementById("floating-button");
    const submitViewer = document.getElementById("submitViewer");
    const submitContent = document.getElementById("submitContent");

    // Event listeners for opening topic viewer
    topicPanels.forEach((panel) => {
        panel.addEventListener("click", function (e) {
            if (e.target.tagName === "A" || e.target.closest("a")) {
                return;
            }
            e.stopPropagation();
            openViewer(panel);
        });
    });

    // Event listener for floating button to open submit viewer
    floatingButton.addEventListener("click", function (e) {
        e.stopPropagation();
        openSubmitViewer();
    });

    // Event listeners for closing viewers
    closeViewerBtnD.forEach((button) => {
        button.addEventListener("click", closeViewer);
    });
    closeViewerBtnM.addEventListener("click", closeViewer);

    // Handle outside clicks
    function handleOutsideClick(e) {
        if (!topic.contains(e.target)) closeViewer();
    }

    function handleOutsideClickSubmit(e) {
        if (!submitViewer.contains(e.target)) closeViewer();
    }

    // Handle ESC key press
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && topic.classList.contains("open")) {
            closeViewer();
        }
    });

    // Function to open topic viewer
    function openViewer(panel) {
        const avatar = panel.querySelector(".avatar")?.innerHTML || "";
        const name = panel.querySelector(".name")?.textContent || "Anonymous";
        const title =
            panel.querySelector(".topic-box h2")?.textContent || "No Title";
        const content =
            panel.querySelector(".topic-box p")?.textContent || "No Content";
        const images = panel.querySelectorAll(".thumbnail-container img");
        const topicId = panel.dataset.topicId;

        let imagesHTML = "";
        if (images.length > 0) {
            imagesHTML = '<div class="viewer-images">';
            images.forEach((img) => {
                imagesHTML += `<img class="viewer-image" src="${img.src}" alt="${img.alt}">`;
            });
            imagesHTML += "</div>";
        }

        topicContent.innerHTML = `
            <div class="viewer-header">
                ${
                    avatar.includes("img")
                        ? avatar.replace(
                              'width="2rem" height="2rem"',
                              'class="viewer-avatar"'
                          )
                        : `<div class="viewer-avatar" style="background-color: #eee;"></div>`
                }
                <div class="viewer-user-info">
                    <span class="viewer-username">${name}</span>
                    <span class="viewer-post-time">Posted just now</span>
                </div>
            </div>
            <h1 class="viewer-title">${title}</h1>
            <div class="viewer-content-text">${content}</div>
            ${imagesHTML}
        `;

        const comments = panel.querySelectorAll(".comment");
        let commentsHTML = "";

        if (comments.length > 0) {
            commentsHTML =
                '<div class="comment-section"><h3 class="viewer-comments-title">Comments</h3><div class="comment-list">';

            comments.forEach((comment) => {
                const avatar =
                    comment.querySelector(".comment-avatar")?.outerHTML ||
                    '<div class="comment-avatar"></div>';
                const username =
                    comment.querySelector(".comment-username")?.textContent ||
                    "Anonymous";
                const time =
                    comment.querySelector(".comment-time")?.textContent ||
                    "Just now";
                const text =
                    comment.querySelector(".comment-text")?.textContent || "";

                commentsHTML += `
            <div class="comment">
                ${avatar}
                <div class="comment-content">
                    <div class="comment-user-info">
                        <span class="comment-username">${username}</span>
                        <span class="comment-time">${time}</span>
                    </div>
                    <div class="comment-text">${text}</div>
                </div>
            </div>
        `;
            });

            commentsHTML += "</div></div>";
        }

        // Then add commentsHTML to the topicContent.innerHTML:
        topicContent.innerHTML = `
    <div class="viewer-header">
        ${
            avatar.includes("img")
                ? avatar.replace(
                      'width="2rem" height="2rem"',
                      'class="viewer-avatar"'
                  )
                : `<div class="viewer-avatar" style="background-color: #eee;"></div>`
        }
        <div class="viewer-user-info">
            <span class="viewer-username">${name}</span>
            <span class="viewer-post-time">Posted just now</span>
        </div>
    </div>
    <h1 class="viewer-title">${title}</h1>
    <div class="viewer-content-text">${content}</div>
    ${imagesHTML}
    ${commentsHTML}
    `;

        topic.classList.add("open");
        document.addEventListener("click", handleOutsideClick);
        closeViewerBtnM.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    // Function to open submit viewer
    function openSubmitViewer() {
        submitContent.innerHTML = `
            <h2 class="submit-title">Create New Post</h2>
            <form id="postForm">
                <div class="form-group">
                    <label for="postTitle">Title</label>
                    <input type="text" id="postTitle" required placeholder="New Topic">
                </div>
                <div class="form-group">
                    <label for="postContent">Content</label>
                    <textarea id="postContent" rows="5"></textarea>
                </div>
                <div class="form-group">
                    <label>Images</label>
                    <div class="upload-instruction">(Max 4 images)</div>
                    <div class="upload-grid">
                        <div class="upload-container" id="uploadTrigger">
                            <input type="file" id="postImages" multiple accept="image/*" style="display: none;">
                            <div class="upload-placeholder">+</div>
                        </div>
                    </div>
                </div>
                <p>Pick one of your identities to <span class="positive">Post:</span></p>
                <div class="account-list"></div>
                <div class="form-feedback" style="display: none;"></div>
            </form>
        `;

        getAccount();
        setupImageUpload();
        submitViewer.classList.add("open");
        document.addEventListener("click", handleOutsideClickSubmit);
        closeViewerBtnM.style.display = "block";
        document.body.style.overflow = "hidden";

        const accountList = submitContent.querySelector(".account-list");
        if (accountList) {
            accountList.addEventListener("click", handleAccountSelection);
        }
    }

    // Function to handle account selection and form submission
    function handleAccountSelection(e) {
        const accountElement = e.target.closest(".account");
        if (!accountElement || !submitViewer.classList.contains("open")) return;

        e.preventDefault();
        e.stopPropagation();

        document.querySelectorAll(".account").forEach((acc) => {
            acc.classList.remove("submitting");
        });

        accountElement.classList.add("submitting");
        const existingFeedback = submitContent.querySelector(".form-feedback");
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedback = document.createElement("div");
        feedback.className = "form-feedback";
        accountElement.appendChild(feedback);

        const postTitle = document.getElementById("postTitle").value.trim();
        const postContent = document.getElementById("postContent").value.trim();

        if (!postTitle) {
            feedback.style.display = "block";
            feedback.textContent = "Please fill in the title";
            feedback.className = "form-feedback error";
            return;
        }

        // 重置所有account的选中状态
        document.querySelectorAll(".account").forEach((acc) => {
            acc.classList.remove("submitting", "selected");
        });

        accountElement.classList.add("submitting", "selected");
        feedback.className = "form-feedback submitting";
        feedback.textContent = "Submitting...";
        feedback.style.display = "block";

        // Get account info
        const accountName = accountElement.querySelector(".name").textContent;
        const accountAvatar = accountElement.querySelector(".avatar img")?.src;

        // Get uploaded images
        const uploadContainers = document.querySelectorAll(
            ".upload-container img"
        );
        const uploadedImages = Array.from(uploadContainers).map(
            (img) => img.src
        );

        // Prepare form data
        const formData = new FormData();
        formData.append("author_name", accountName);
        formData.append("post_title", postTitle);
        formData.append("description", postContent);

        // Add avatar
        if (accountAvatar && accountAvatar.startsWith("data:")) {
            const blob = dataURLtoBlob(accountAvatar);
            if (blob) {
                formData.append("photo1", blob, "avatar.jpg");
            }
        }

        // Add uploaded images
        uploadedImages.forEach((imgSrc, index) => {
            if (imgSrc && imgSrc.startsWith("data:")) {
                const blob = dataURLtoBlob(imgSrc);
                if (blob) {
                    formData.append(
                        `photo${index + 2}`,
                        blob,
                        `image${index + 2}.jpg`
                    );
                }
            }
        });

        // Submit the form
        submitPost(formData, accountElement, feedback);
    }

    async function submitPost(formData, accountElement, feedbackElement) {
        try {
            const { success, data } = await postFormData(
                formData,
                "https://damp-castle-6239-1b70ee448fbd.herokuapp.com/decoapi/multiphotopost/",
                {
                    student_number: "s4896726",
                    uqcloud_zone_id: "78e5a047",
                }
            );

            if (success) {
                feedbackElement.textContent =
                    data.message || "Submission successful!";
                feedbackElement.className = "form-feedback success";

                // 不自动清除表单内容，保持用户输入
                // 只重置图片上传区域
                document.querySelector(".upload-grid").innerHTML = "";
                createUploadContainer(document.querySelector(".upload-grid"));
            } else {
                feedbackElement.textContent =
                    data.message ||
                    "Submission failed. Please check your input.";
                feedbackElement.className = "form-feedback error";
            }
        } catch (error) {
            console.error("Submission error:", error);
            feedbackElement.textContent =
                "Network error. Please try again later.";
            feedbackElement.className = "form-feedback error";
        } finally {
            // 3秒后移除反馈信息，但保持选中状态
            setTimeout(() => {
                feedbackElement.remove();
                accountElement.classList.remove("submitting");
            }, 3000);
        }
    }

    // Helper function to convert data URL to Blob
    function dataURLtoBlob(dataURL) {
        if (
            !dataURL ||
            typeof dataURL !== "string" ||
            !dataURL.startsWith("data:")
        ) {
            console.error("Invalid data URL:", dataURL);
            return null;
        }

        try {
            const arr = dataURL.split(",");
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch) {
                throw new Error("Invalid data URL format");
            }

            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            const u8arr = new Uint8Array(bstr.length);

            for (let i = 0; i < bstr.length; i++) {
                u8arr[i] = bstr.charCodeAt(i);
            }

            return new Blob([u8arr], { type: mime });
        } catch (error) {
            console.error("Error converting data URL to Blob:", error);
            return null;
        }
    }

    // Function to submit post data
    async function submitPost(formData, accountElement, feedbackElement) {
        try {
            const { success, data } = await postFormData(
                formData,
                "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/multiphotopost/",
                {
                    student_number: "s4896726",
                    uqcloud_zone_id: "78e5a047",
                }
            );

            if (success) {
                feedbackElement.textContent =
                    data.message || "Submission successful!";
                feedbackElement.className = "form-feedback success";

                // 不自动清除表单内容，保持用户输入
                // 只重置图片上传区域
                document.querySelector(".upload-grid").innerHTML = "";
                createUploadContainer(document.querySelector(".upload-grid"));
            } else {
                feedbackElement.textContent =
                    data.message ||
                    "Submission failed. Please check your input.";
                feedbackElement.className = "form-feedback error";
            }
        } catch (error) {
            console.error("Submission error:", error);
            feedbackElement.textContent =
                "Network error. Please try again later.";
            feedbackElement.className = "form-feedback error";
        } finally {
            // 3秒后移除反馈信息，但保持选中状态
            setTimeout(() => {
                feedbackElement.remove();
                accountElement.classList.remove("submitting");
            }, 3000);
        }
    }

    // Function to close viewer
    function closeViewer() {
        topic.classList.remove("open");
        submitViewer.classList.remove("open");
        document.removeEventListener("click", handleOutsideClick);
        document.removeEventListener("click", handleOutsideClickSubmit);
        closeViewerBtnM.style.display = "none";
        document.body.style.overflow = "";
    }

    // Function to setup image upload functionality
    function setupImageUpload() {
        const uploadGrid = document.querySelector(".upload-grid");
        if (!uploadGrid) return;

        // Initialize with one empty upload container
        uploadGrid.innerHTML = "";
        createUploadContainer(uploadGrid);

        function createUploadContainer(parent) {
            if (parent.querySelectorAll(".upload-container").length >= 4)
                return;

            const container = document.createElement("div");
            container.className = "upload-container";

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.multiple = false;
            fileInput.accept = "image/*";
            fileInput.style.display = "none";

            const placeholder = document.createElement("div");
            placeholder.className = "upload-placeholder";
            placeholder.textContent = "+";

            container.appendChild(fileInput);
            container.appendChild(placeholder);
            parent.appendChild(container);

            // Click handler for this container
            container.addEventListener("click", (e) => {
                if (!e.target.classList.contains("remove-image")) {
                    fileInput.click();
                }
            });

            fileInput.addEventListener("change", (e) => {
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const reader = new FileReader();

                    reader.onload = (event) => {
                        // Replace with image preview
                        container.innerHTML = `
                            <img src="${event.target.result}" alt="Preview">
                            <button class="remove-image">×</button>
                        `;

                        // Add remove handler
                        container
                            .querySelector(".remove-image")
                            .addEventListener("click", (e) => {
                                e.stopPropagation();
                                removeImageContainer(container, parent);
                            });

                        // Add new container if needed
                        if (
                            parent.querySelectorAll(".upload-container")
                                .length < 4 &&
                            parent.querySelectorAll(".upload-container img")
                                .length < 4
                        ) {
                            createUploadContainer(parent);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function removeImageContainer(container, parent) {
            const allContainers = parent.querySelectorAll(".upload-container");
            const imageContainers = parent.querySelectorAll(
                ".upload-container img"
            );

            // Always remove the clicked container
            container.remove();

            // If we just deleted an image and have no more images, ensure at least one upload container
            if (imageContainers.length === 1 && allContainers.length === 1) {
                createUploadContainer(parent);
            }
            // If we're below max capacity, we might need to add back an upload container
            else if (allContainers.length < 4) {
                // Check if we have any empty upload containers left
                const hasEmptyContainer = Array.from(allContainers).some(
                    (cont) => cont.querySelector(".upload-placeholder")
                );

                if (!hasEmptyContainer) {
                    createUploadContainer(parent);
                }
            }
        }
    }
}

function formatDateTime(date) {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(date).toLocaleString("en-US", options);
}

// 获取评论函数
async function fetchComments(topicId) {
    try {
        const response = await fetch(
            "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/getchat/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_post_title: topicId.toString(),
                    student_number: "s4896726",
                    uqcloud_zone_id: "78e5a047",
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

// 显示评论函数
function displayComments(comments, commentListElement) {
    commentListElement.innerHTML = "";

    comments.forEach((comment) => {
        const [avatarUrl, content] = comment.chat_post_content.split(" | ");

        const commentElement = document.createElement("div");
        commentElement.className = "comment";
        commentElement.innerHTML = `
            <div class="comment-avatar" style="background-image: url(${avatarUrl})"></div>
            <div class="comment-content">
                <div class="comment-user-info">
                    <span class="comment-username">${comment.person_name}</span>
                    <span class="comment-time">${formatDateTime(
                        comment.chat_date_time
                    )}</span>
                </div>
                <div class="comment-text">${content}</div>
            </div>
        `;

        commentListElement.appendChild(commentElement);
    });
}

// 发送评论函数
async function postComment(topicId, personName, content, avatarUrl) {
    try {
        const response = await fetch(
            "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/postchat/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    person_name: personName,
                    chat_post_title: topicId.toString(),
                    chat_post_content: `${avatarUrl} | ${content}`,
                    student_number: "s4896726",
                    uqcloud_zone_id: "78e5a047",
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to post comment");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error posting comment:", error);
        return null;
    }
}
