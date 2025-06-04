/**
 * IMPORTS
 * Keep track of external modules being used
 * */
import { setupMenu } from "./modules/menu.js";
import { initViewer } from "./modules/viewer.js";
import { fetchGetData } from "./modules/getData.js";
import { initThumbnailLimit } from "./modules/thumbnail-limit.js";
import { initTopic } from "./modules/topic.js";
import { setSearch } from "./modules/search.js";
/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 * */

const header = { student_number: "s4896726", uqcloud_zone_id: "78e5a047" };
/**
 * VARIABLES
 * Define values that will change e.g. user inputs, counters, etc.
 * */

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 * */
// Function to create topic panels from backend data
function createTopicPanels(posts) {
    const container = document.querySelector(".container");

    posts.forEach((post) => {
        if (Number(post.id) > 497) {
            const panel = document.createElement("section");
            panel.className = "panel topic";

            const avatar = document.createElement("div");
            avatar.className = "avatar";

            // Extract avatar URL and actual description from description field
            const descriptionParts = post.description.split(" | ");
            let avatarUrl = descriptionParts[0].replace(/[ |]+$/, "");
            const actualDescription = descriptionParts.slice(1).join(" | ");

            if (avatarUrl && avatarUrl.startsWith("http")) {
                const avatarImg = document.createElement("img");
                avatarImg.src = avatarUrl;
                avatarImg.alt = `${post.author_name}`;
                avatar.appendChild(avatarImg);
            }

            const name = document.createElement("div");
            name.className = "name";
            name.textContent = post.author_name;

            const topicBox = document.createElement("div");
            topicBox.className = "topic-box";
            topicBox.id = `post-${post.id}`;

            const textContent = document.createElement("div");
            textContent.className = "text-content";

            const title = document.createElement("h2");
            title.textContent = post.post_title;

            const description = document.createElement("p");
            description.textContent = actualDescription;

            textContent.appendChild(title);
            textContent.appendChild(description);

            const thumbnailsWrapper = document.createElement("div");
            thumbnailsWrapper.className = "thumbnails-wrapper";

            // Now photo1-5 are all post attachments
            for (let i = 1; i <= 5; i++) {
                const photoKey = `photo${i}`;
                if (post[photoKey]) {
                    const thumbnailContainer = document.createElement("div");
                    thumbnailContainer.className = "thumbnail-container";

                    const img = document.createElement("img");
                    img.src = post[photoKey];
                    img.alt = `${post.post_title}${i}`;

                    thumbnailContainer.appendChild(img);
                    thumbnailsWrapper.appendChild(thumbnailContainer);
                }
            }

            topicBox.appendChild(textContent);
            if (thumbnailsWrapper.children.length > 0) {
                topicBox.appendChild(thumbnailsWrapper);
            }

            // Create comment section structure (only comment list, no form)
            const commentSection = createCommentSectionStructure(false);
            topicBox.appendChild(commentSection);

            panel.appendChild(avatar);
            panel.appendChild(name);
            panel.appendChild(topicBox);

            container.appendChild(panel);
        }
    });
}

// Function to create the comment section HTML structure
function createCommentSectionStructure(includeForm = true) {
    const commentSection = document.createElement("div");
    commentSection.className = "comment-section";

    const commentList = document.createElement("div");
    commentList.className = "comment-list";

    commentSection.appendChild(commentList);

    // Only include comment form if specifically requested (for topicViewer)
    if (includeForm) {
        const commentForm = document.createElement("div");
        commentForm.className = "comment-form";

        const commentInput = document.createElement("textarea");
        commentInput.id = "commentInput";
        commentInput.placeholder = "Write a comment...";
        commentInput.className = "comment-input";

        const submitButton = document.createElement("button");
        submitButton.id = "submitComment";
        submitButton.className = "comment-submit";
        submitButton.textContent = "Post Comment";
        submitButton.disabled = true;

        const accountSelection = document.createElement("div");
        accountSelection.className = "comment-account-selection";

        const accountLabel = document.createElement("p");
        accountLabel.textContent = "Comment as:";

        const accountList = document.createElement("div");
        accountList.className = "account-list";
        accountList.id = "commentAccountList";

        const loadingAccounts = document.createElement("div");
        loadingAccounts.className = "loading-accounts";
        accountList.appendChild(loadingAccounts);

        accountSelection.appendChild(accountLabel);
        accountSelection.appendChild(accountList);

        commentForm.appendChild(commentInput);
        commentForm.appendChild(submitButton);
        commentForm.appendChild(accountSelection);

        commentSection.appendChild(commentForm);
    }

    return commentSection;
}

// Function to fetch and populate comments for all topics
async function loadCommentsForAllTopics() {
    try {
        const commentsData = await fetchGetData(
            "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericchat/",
            header
        );

        if (commentsData && Array.isArray(commentsData)) {
            populateComments(commentsData);
        } else {
            console.log("No comments data received or error occurred");
        }
    } catch (error) {
        console.error("Error loading comments:", error);
    }
}

// Function to populate comments into their respective topic boxes
function populateComments(comments) {
    // Group comments by topic ID
    const commentsByTopic = {};

    comments.forEach((comment) => {
        const topicId = comment.chat_post_title; // 这个值是 "example"
        if (!commentsByTopic[topicId]) {
            commentsByTopic[topicId] = [];
        }
        commentsByTopic[topicId].push(comment);
    });

    // Populate comments for each topic
    Object.keys(commentsByTopic).forEach((topicId) => {
        let topicBox = document.querySelector(`#${topicId}`);

        if (!topicBox) {
            topicBox = document.querySelector(`#post-${topicId}`);
        }

        if (!topicBox) {
            const allTopicBoxes = document.querySelectorAll(".topic-box");
            topicBox = Array.from(allTopicBoxes).find((box) => {
                const title = box.querySelector("h2")?.textContent;
                return title === topicId;
            });
        }

        if (topicBox) {
            const commentList = topicBox.querySelector(".comment-list");
            if (commentList) {
                // Clear existing comments (if any)
                commentList.innerHTML = "";
                // Add comments to this topic
                const topicComments = commentsByTopic[topicId];
                topicComments.forEach((comment, index) => {
                    const commentElement = createCommentElement(comment, index);
                    commentList.appendChild(commentElement);
                });
            }
        }
    });
}
// Function to create individual comment elements
function createCommentElement(comment, index) {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";

    // Add hidden class to all comments except the first one
    if (index > 0) {
        commentDiv.classList.add("hidden");
    }

    // Create comment avatar
    const commentAvatar = document.createElement("div");
    commentAvatar.className = "comment-avatar";

    // Extract avatar URL from chat_post_content (before the first " | ")
    const contentParts = comment.chat_post_content.split(" | ");
    const avatarUrl = contentParts[0];

    if (avatarUrl && avatarUrl.startsWith("http")) {
        const avatarImg = document.createElement("img");
        avatarImg.src = avatarUrl;
        avatarImg.alt = `${comment.person_name}'s avartar'`;
        avatarImg.style.width = "100%";
        avatarImg.style.height = "100%";
        avatarImg.style.objectFit = "cover";
        avatarImg.style.borderRadius = "50%";
        commentAvatar.appendChild(avatarImg);
    }

    // Create comment content wrapper
    const commentContent = document.createElement("div");
    commentContent.className = "comment-content";

    // Create user info section
    const commentUserInfo = document.createElement("div");
    commentUserInfo.className = "comment-user-info";

    const commentUsername = document.createElement("span");
    commentUsername.className = "comment-username";
    commentUsername.textContent = comment.person_name;

    const commentTime = document.createElement("span");
    commentTime.className = "comment-time";
    commentTime.textContent = formatCommentTime(comment.chat_date_time);

    commentUserInfo.appendChild(commentUsername);
    commentUserInfo.appendChild(commentTime);

    // Create comment text
    const commentText = document.createElement("div");
    commentText.className = "comment-text";

    // Extract actual comment content (after the first " | ")
    const actualComment = contentParts.slice(1).join(" | ");
    commentText.textContent = actualComment;

    // Assemble comment content
    commentContent.appendChild(commentUserInfo);
    commentContent.appendChild(commentText);

    // Assemble final comment
    commentDiv.appendChild(commentAvatar);
    commentDiv.appendChild(commentContent);

    return commentDiv;
}

// Function to format comment time (you can customize this as needed)
function formatCommentTime(dateTimeString) {
    try {
        const commentDate = new Date(dateTimeString);
        const now = new Date();
        const diffMs = now - commentDate;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        } else {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
        }
    } catch (error) {
        return dateTimeString; // Return original string if parsing fails
    }
}

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 * */

// when the page fully loads
document.addEventListener("DOMContentLoaded", async () => {
    // Load posts first
    const postsData = await fetchGetData(
        "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/multiphotopost/",
        header
    );

    if (postsData) {
        createTopicPanels(postsData);
        // After creating topic panels, load comments
        await loadCommentsForAllTopics();
    } else {
        console.log("No data received or error occurred");
    }
    initTopic();
    initThumbnailLimit();
    setupMenu();
    initViewer();
    setSearch();
});
