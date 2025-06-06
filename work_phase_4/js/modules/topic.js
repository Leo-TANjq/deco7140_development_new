import { getAccount } from "./account.js";

export function initTopic(indentifier = "") {
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
    topicContent.addEventListener("click", function (e) {
        if (e.target.id === "submitComment") {
            submitComment();
        }
    });

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
    async function openViewer(panel) {
        const avatarElement = panel.querySelector(".avatar img");
        const avatarSrc = avatarElement ? avatarElement.src : "";
        const nameElement = panel.querySelector(".name");
        const name =
            nameElement?.firstChild?.textContent?.trim() || "Anonymous";
        const title = panel.querySelector(".topic-box h2")?.textContent || "";
        const content = panel.querySelector(".topic-box p")?.textContent || "";
        const images = panel.querySelectorAll(".thumbnail-container img");
        const topicId = panel.querySelector(".topic-box")?.id;
        const datePosted =
            panel.querySelector(".topic-box")?.dataset.datePosted;
        const formattedTime = datePosted ? datePosted : "Unkonwn Post Time";
        if (topicId) {
            topic.dataset.topicId = topicId;
        }

        let imagesHTML = "";
        if (images.length > 0) {
            imagesHTML = '<div class="viewer-images">';
            images.forEach((img) => {
                imagesHTML += `<img class="viewer-image" src="${img.src}" alt="${img.alt}">`;
            });
            imagesHTML += "</div>";
        }

        const commentFormHTML = `
        <div class="comment-form">
            <textarea id="commentInput" placeholder="Write a comment..." class="comment-input"></textarea>
            <button id="submitComment" class="comment-submit" disabled>Post Comment</button>
            <div class="comment-account-selection">
                <p>Comment as:</p>
                <div class="account-list" id="commentAccountList">
                    <div class="loading-accounts"></div>
                </div>
            </div>
        </div>
    `;

        const avatarHTML = avatarSrc
            ? `<div class="viewer-avatar">
               <img src="${avatarSrc}" alt="${name}" class="viewer-avatar-img">
           </div>`
            : `<div class="viewer-avatar" style="background-color: #eee;"></div>`;

        topicContent.innerHTML = `
        <div class="viewer-header">
            ${avatarHTML}
            <div class="viewer-user-info">
                <span class="viewer-username">${name}</span>
                <span class="viewer-post-time">Posted at ${formattedTime}</span>
            </div>
        </div>
        <h1 class="viewer-title">${title}</h1>
        <div class="viewer-content-text">${content}</div>
        ${imagesHTML}
        ${
            panel.querySelectorAll(".comment").length > 0
                ? `
            <div class="comment-section">
                <h3 class="viewer-comments-title">Comments</h3>
                <div class="comment-list">
                    ${Array.from(panel.querySelectorAll(".comment"))
                        .map(
                            (comment) =>
                                `<div class="comment">${comment.innerHTML}</div>`
                        )
                        .join("")}
                </div>
            </div>
        `
                : ""
        }
        ${commentFormHTML}
    `;

        topic.classList.add("open");
        document.addEventListener("click", handleOutsideClick);
        closeViewerBtnM.style.display = "block";
        document.body.style.overflow = "hidden";

        getAccount(indentifier);

        topicContent.addEventListener("click", function (e) {
            const account = e.target.closest(".account");
            if (account && commentAccountList.contains(account)) {
                const accounts =
                    commentAccountList.querySelectorAll(".account");
                accounts.forEach((acc) => acc.classList.remove("selected"));
                account.classList.add("selected");
                document.getElementById("submitComment").disabled = false;
            }
        });
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

        getAccount(indentifier);
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
    async function submitComment() {
        const topicId = topic.dataset.topicId;
        const commentInput = document.getElementById("commentInput");
        const commentText = commentInput.value.trim();
        const accountList = document.getElementById("commentAccountList");
        const selectedAccount = accountList.querySelector(".account.selected");

        if (!commentText) {
            alert("Please write a comment.");
            return;
        }

        if (!selectedAccount) {
            alert("Please select an account to comment as.");
            return;
        }

        const personName = selectedAccount.querySelector(".name").textContent;
        const accountAvatar = selectedAccount.querySelector(".avatar img")?.src;
        const chatPostContent = `${accountAvatar} | ${commentText}`;

        const formData = new FormData();
        formData.append("person_name", personName);
        formData.append("chat_post_title", topicId);
        formData.append("chat_post_content", chatPostContent);

        try {
            const response = await fetch(
                "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericchat/",
                {
                    method: "POST",
                    headers: {
                        student_number: "s4896726",
                        uqcloud_zone_id: "78e5a047",
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert("Comment submitted successfully!");
            commentInput.value = "";

            document.getElementById("submitComment").disabled = true;

            const accounts = accountList.querySelectorAll(".account");
            accounts.forEach((acc) => acc.classList.remove("selected"));

            const commentSection =
                topicContent.querySelector(".comment-section");
            if (!commentSection) {
                const commentSectionHTML = `
                <div class="comment-section">
                    <h3 class="viewer-comments-title">Comments</h3>
                    <div class="comment-list"></div>
                </div>
            `;
                topicContent.insertAdjacentHTML(
                    "beforeend",
                    commentSectionHTML
                );
            }
            const commentList = topicContent.querySelector(".comment-list");
            const newCommentHTML = `
            <div class="comment">
                <div class="comment-avatar">
                    <img src="${accountAvatar}" alt="${personName}">
                </div>
                <div class="comment-content">
                    <span class="comment-author">${personName}</span>
                    <p class="comment-text">${commentText}</p>
                </div>
            </div>
        `;
            commentList.insertAdjacentHTML("beforeend", newCommentHTML);
        } catch (error) {
            console.error("Error submitting comment:", error);
            alert("Network error. Please try again later.");
        }
    }

    // Function to handle account selection and form submission
    function handleAccountSelection(e) {
        const accountElement = e.target.closest(".account");
        if (!accountElement || !submitViewer.classList.contains("open")) return;

        e.preventDefault();
        e.stopPropagation();

        document.querySelectorAll(".account").forEach((acc) => {
            acc.classList.remove("submitting", "selected");
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

        const combinedDescription = accountAvatar
            ? `${accountAvatar} | ${postContent}`
            : postContent;
        formData.append("description", combinedDescription);

        let hasError = false;
        // Add uploaded image links
        uploadedImages.forEach((imgSrc, index) => {
            if (imgSrc && imgSrc.startsWith("data:")) {
                const blob = dataURLtoBlob(imgSrc);
                if (blob) {
                    const extension = blob.type.includes("png") ? "png" : "jpg";
                    formData.append(
                        `photo${index + 1}`,
                        blob,
                        `image${index + 1}.${extension}`
                    );
                } else {
                    console.error(
                        `Failed to convert image ${index + 1} to blob`
                    );
                    hasError = true;
                }
            }
        });

        if (hasError) {
            feedback.textContent = "Image processing failed. Please try again.";
            feedback.className = "form-feedback error";
            accountElement.classList.remove("submitting");
            return;
        }
        // Submit the form
        submitPost(formData, accountElement, feedback);
    }

    function dataURLtoBlob(dataURL) {
        if (!dataURL || !dataURL.startsWith("data:")) {
            console.error("Invalid Data URL format");
            return null;
        }

        try {
            const parts = dataURL.split(",");
            if (parts.length !== 2) {
                throw new Error("Invalid Data URL structure");
            }

            const mimeMatch = parts[0].match(/:(.*?);/);
            if (!mimeMatch) {
                throw new Error("Cannot extract MIME type");
            }

            const mime = mimeMatch[1];
            let base64 = parts[1];

            base64 = base64.replace(/\s/g, "");

            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
                throw new Error("Invalid Base64 format");
            }

            const binStr = atob(base64);
            const len = binStr.length;
            const arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            return new Blob([arr], { type: mime });
        } catch (error) {
            console.error("DataURL to Blob conversion failed:", error);
            return null;
        }
    }
    // Function to submit post data
    async function submitPost(formData, accountElement, feedbackElement) {
        try {
            const response = await fetch(
                "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/multiphotopost/",
                {
                    method: "POST",
                    headers: {
                        student_number: "s4896726",
                        uqcloud_zone_id: "78e5a047",
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                feedbackElement.textContent =
                    "Submission failed. Please check your input.";
                feedbackElement.className = "form-feedback error";
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert("Successfully Submit! ");

            closeViewer();
            location.reload();
        } catch (error) {
            console.error("Submission error:", error);
            feedbackElement.textContent =
                "Network error. Please try again later.";
            feedbackElement.className = "form-feedback error";
        } finally {
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
    }
}
function createUploadContainer(parent) {
    if (parent.querySelectorAll(".upload-container").length >= 5) return;
    const imageContainers = parent.querySelectorAll(".upload-container img");
    const allContainers = parent.querySelectorAll(".upload-container");
    if (allContainers.length != imageContainers.length) return;

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

    fileInput.addEventListener("change", async (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];

            // Add file size check
            if (file.size > 10 * 1024 * 1024) {
                // 10MB limit
                alert(
                    "Image file is too large. Please select an image smaller than 10MB."
                );
                return;
            }

            try {
                // Show loading state
                placeholder.textContent = "Processing...";

                // Compress image
                const compressedFile = await compressImage(file);

                // Use compressed file
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
                            container.remove();
                            createUploadContainer(parent);
                        });
                    createUploadContainer(parent);
                };

                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error("Image processing failed:", error);
                alert("Image processing failed. Please try another image.");
                placeholder.textContent = "+"; // Restore original state
            }
        }
    });
}
function compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            let { width, height } = img;
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(resolve, "image/jpeg", quality);
        };

        img.src = URL.createObjectURL(file);
    });
}
