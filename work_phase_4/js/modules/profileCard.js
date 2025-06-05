function createProfileCard(profile, identifier = "") {
    const displayEmail =
        identifier && profile.email.startsWith(`$%$${identifier}`)
            ? profile.email.replace(`$%$${identifier}`, "")
            : profile.email;
    const [avatarSrc, section1Title, customField1Content] =
        profile.custom_field_longtext_1
            ? profile.custom_field_longtext_1
                  .split(" | ")
                  .map((part) => (part === "$Null$" ? "" : part))
            : ["", "", ""];

    const [websiteUrl, section2Title, customField2Content] =
        profile.custom_field_longtext_2
            ? profile.custom_field_longtext_2
                  .split(" | ")
                  .map((part) => (part === "$Null$" ? "" : part))
            : ["", "", ""];

    const card = document.createElement("div");
    card.className = "user-profile-card";

    if (profile.profile_photo) {
        card.style.backgroundImage = `url(${profile.profile_photo})`;
        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";
        card.style.backgroundRepeat = "no-repeat";
    }

    card.innerHTML = `
        <div class="profile-avatar-section">
            <img src="${avatarSrc || "images/default.png"}" alt="${
        profile.user_name
    }'s Profile" class="profile-avatar" />
            <div class="profile-basic-info">
                <h2 class="user-name">${profile.user_name || ""}</h2>
                <p class="user-email">${displayEmail || ""}</p>
                ${
                    profile.experience_level
                        ? `<div class="experience-badge">${profile.experience_level}</div>`
                        : ""
                }
            </div>
        </div>
        <div class="profile-details-section">
            ${
                section1Title ||
                profile.custom_field_1 ||
                profile.custom_field_2
                    ? `
            <div class="profile-section">
                ${
                    section1Title
                        ? `<h3 class="section-title">${section1Title}</h3>`
                        : ""
                }
                <ul class="profile-list">
                    ${
                        profile.custom_field_1
                            ? `<li>${profile.custom_field_1}</li>`
                            : ""
                    }
                    ${
                        profile.custom_field_2
                            ? `<li>${profile.custom_field_2}</li>`
                            : ""
                    }
                </ul>
            </div>
            `
                    : ""
            }
            
            ${
                section2Title || customField1Content || customField2Content
                    ? `
            <div class="profile-section">
                ${
                    section2Title
                        ? `<h3 class="section-title">${section2Title}</h3>`
                        : ""
                }
                ${
                    customField1Content
                        ? `<p class="long-text">${customField1Content}</p>`
                        : ""
                }
                ${
                    customField2Content
                        ? `<p class="long-text">${customField2Content}</p>`
                        : ""
                }
            </div>
            `
                    : ""
            }
            
            <div class="profile-meta">
                ${
                    profile.date_created
                        ? `
                <p class="created-date">
                    Joined: ${new Date(profile.date_created).toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    )}
                </p>
                `
                        : ""
                }
                
                ${
                    websiteUrl && isValidUrl(websiteUrl)
                        ? `
                <p class="website-link">
                    <a href="${ensureHttpPrefix(
                        websiteUrl
                    )}" target="_blank">View Personal Website</a>
                </p>
                `
                        : ""
                }
            </div>
        </div>
    `;

    return card;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function ensureHttpPrefix(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`;
    }
    return url;
}

function showCreateProfileForm(name, email, avatar, identifier = "") {
    const displayArea = document.querySelector(".display");

    displayArea.innerHTML = "";

    const formContainer = document.createElement("div");
    formContainer.className = "profile-form-container";
    formContainer.innerHTML = `
        <form id="create-profile-form">
            <div class="user-profile-card">
                <div class="profile-avatar-section">
                    <img
                        src="${avatar || "images/default.png"}"
                        alt="${name}'s Profile"
                        class="profile-avatar"
                    />
                    <div class="profile-basic-info">
                        <h2 class="user-name">${name}</h2>
                        <p class="user-email">${email}</p>
                        <input
                            type="text"
                            name="experience_level"
                            class="experience-badge"
                            placeholder="Tagline..."
                        />
                    </div>
                </div>

                <div class="profile-details-section">
                    <div class="profile-section">
                        <div class="section-title">
                            <input
                                type="text"
                                class="experience-badge"
                                name="section1"
                                placeholder="Section Title..."
                            />
                        </div>
                        <ul class="profile-list">
                            <li>
                                <input
                                    type="text"
                                    name="custom_field_1"
                                    class="experience-badge"
                                    placeholder="Show something..."
                                />
                            </li>
                            <li>
                                <input
                                    type="text"
                                    name="custom_field_2"
                                    class="experience-badge"
                                    placeholder="Show something..."
                                />
                            </li>
                        </ul>
                    </div>

                    <div class="profile-section">
                        <h3 class="section-title">
                            <input
                                type="text"
                                class="experience-badge"
                                name="section2"
                                placeholder="Section Title..."
                                value="About Me"
                            />
                        </h3>
                        <textarea
                            class="long-text-input"
                            placeholder="More descriptions..."
                            name="custom_field_longtext_1"
                        ></textarea>
                        <textarea
                            class="long-text-input"
                            placeholder="More descriptions..."
                            name="custom_field_longtext_2"
                        ></textarea>
                    </div>

                    <div class="profile-meta">
                        <p class="created-date">
                            Joined: ${new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                        <input
                            type="text"
                            name="website_code"
                            class="experience-badge"
                            placeholder="Your personal website code (optional)"
                        />
                    </div>
                </div>
                <label for="bg-image-upload" class="bg-upload-label">
                    <span>Upload Background</span>
                    <input type="file" id="bg-image-upload" accept="image/*" style="display: none;">
                </label>
            </div>
            <div class="form-actions">
                <button type="submit" class="join-button">Create!</button>
                <button type="button" id="cancel-create-profile" class="join-button cancel">Cancel</button>
            </div>
            <div id="create-feedback"class="form-feedback" style="display: block;">test</div>
        </form>
    `;

    displayArea.appendChild(formContainer);

    const bgUpload = document.getElementById("bg-image-upload");
    bgUpload.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const bgUrl = event.target.result;
            const profileCard =
                formContainer.querySelector(".user-profile-card");
            if (profileCard) {
                profileCard.style.backgroundImage = `url(${bgUrl})`;
                profileCard.style.backgroundSize = "cover";
                profileCard.style.backgroundPosition = "center";
                profileCard.style.backgroundRepeat = "no-repeat";
            }
        };
        reader.readAsDataURL(file);
    });

    document
        .getElementById("cancel-create-profile")
        .addEventListener("click", function () {
            displayArea.innerHTML = "";
            const noProfileMessage = document.createElement("p");
            noProfileMessage.textContent =
                "No profile card found for this account. ";
            const createButton = document.createElement("button");
            createButton.classList.add("join-button");
            createButton.textContent = "Create My Profile Card";
            createButton.dataset.email = email;
            createButton.dataset.name = name;
            createButton.dataset.avatar = avatar;
            createButton.addEventListener("click", function () {
                showCreateProfileForm(name, email, avatar);
            });

            displayArea.appendChild(noProfileMessage);
            displayArea.appendChild(createButton);
        });

    const createForm = document.getElementById("create-profile-form");
    const feedback = document.getElementById("create-feedback");
    const submitButton = createForm.querySelector('button[type="submit"]');

    createForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // 确保反馈元素可见
        feedback.style.display = "block";
        feedback.textContent = "Submitting...";
        feedback.className = "form-feedback processing";
        submitButton.disabled = true;

        const form = e.target;
        const formData = new FormData(form);

        const processedEmail = identifier
            ? `$%$${identifier}${formData.get("email") || email}`
            : formData.get("email") || email;

        const profileData = {
            user_name: formData.get("user_name") || name,
            email: processedEmail,
            experience_level: formData.get("experience_level") || "",
            custom_field_1: formData.get("custom_field_1") || "",
            custom_field_2: formData.get("custom_field_2") || "",

            custom_field_longtext_1: `${avatar || "$Null$"} | ${
                formData.get("section1") || "$Null$"
            } | ${formData.get("custom_field_longtext_1") || "$Null$"}`,
            custom_field_longtext_2: `${
                formData.get("website_code") || "$Null$"
            } | ${formData.get("section2") || "$Null$"} | ${
                formData.get("custom_field_longtext_2") || "$Null$"
            }`,

            website_code: formData.get("website_code") || "",
        };

        const uploadData = new FormData();
        for (const key in profileData) {
            uploadData.append(key, profileData[key]);
        }

        const bgImageInput = document.getElementById("bg-image-upload");
        if (bgImageInput.files && bgImageInput.files[0]) {
            const file = bgImageInput.files[0];

            if (file.size > 10 * 1024 * 1024) {
                feedback.textContent = "Profile photo must be less than 10MB";
                feedback.className = "form-feedback error";
                submitButton.disabled = false;
                return;
            }

            uploadData.append("profile_photo", file);
        }

        try {
            const response = await fetch(
                "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericuserprofile/",
                {
                    method: "POST",
                    headers: {
                        student_number: "s4896726",
                        uqcloud_zone_id: "78e5a047",
                    },
                    body: uploadData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create profile");
            }

            const result = await response.json();
            feedback.textContent = "Profile created successfully!";
            feedback.className = "form-feedback success";

            // 延迟显示成功消息，避免立即被清除
            setTimeout(() => {
                const displayArea = document.querySelector(".display");
                displayArea.innerHTML = "";
                const profileCard = createProfileCard(result, identifier);
                displayArea.appendChild(profileCard);
            }, 1500); // 1.5秒后跳转
        } catch (error) {
            console.error("Error creating profile:", error);
            feedback.textContent = "Error creating profile. Please try again.";
            feedback.className = "form-feedback error";
        } finally {
            submitButton.disabled = false;
        }
    });
}

export async function initProfileCard(profileDataPromise, identifier = "") {
    const profileData = await profileDataPromise;

    // Filter profiles based on identifier if provided
    const filteredProfileData = identifier
        ? profileData.filter((profile) =>
              profile.email.startsWith(`$%$${identifier}`)
          )
        : profileData;

    const toggleButton = document.getElementById("sidebar-toggle");
    document.querySelectorAll(".account-list").forEach((accountList) => {
        accountList.addEventListener("click", async function (e) {
            const account = e.target.closest(".account");
            if (!account) return;

            if (toggleButton) {
                toggleButton.click();
            }
            const email = account.querySelector(".email").textContent;
            const name = account.querySelector(".name").textContent;
            const avatar = account.querySelector(".avatar img").src;

            // Add identifier to email when searching for matching profile
            const searchEmail = identifier ? `$%$${identifier}${email}` : email;

            const matchingProfile = filteredProfileData.find(
                (profile) => profile.email === searchEmail
            );
            const displayArea = document.querySelector(".display");
            displayArea.innerHTML = "";

            if (matchingProfile) {
                const profileCard = createProfileCard(
                    matchingProfile,
                    identifier
                );
                displayArea.appendChild(profileCard);
                displayArea.parentElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else {
                const noProfileMessage = document.createElement("p");
                noProfileMessage.textContent =
                    "No profile card found for this account. ";
                const createButton = document.createElement("button");
                createButton.classList.add("join-button");
                createButton.textContent = "Create My Profile Card";

                createButton.dataset.email = email;
                createButton.dataset.name = name;
                createButton.dataset.avatar = avatar;
                createButton.dataset.identifier = identifier;

                createButton.addEventListener("click", function () {
                    showCreateProfileForm(name, email, avatar, identifier);
                });

                displayArea.appendChild(noProfileMessage);
                displayArea.appendChild(createButton);
                displayArea.parentElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });
}
