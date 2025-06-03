    /**
     * IMPORTS
     * Keep track of external modules being used
     * */
    import { setupMenu } from "./modules/menu.js";
    import { initViewer } from "./modules/viewer.js";
    import { fetchGetData } from "./modules/getData.js";
    import { initJoin } from "./modules/join.js";
    import { initThumbnailLimit } from "./modules/thumbnail-limit.js";
    import { initTopic } from "./modules/topic.js";
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
            const panel = document.createElement("section");
            panel.className = "panel topic";

            const avatar = document.createElement("div");
            avatar.className = "avatar";
            if (post.photo1) {
                const avatarImg = document.createElement("img");
                avatarImg.src = post.photo1;
                avatarImg.alt = `${post.author_name}的头像`;
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
            description.textContent = post.description;

            textContent.appendChild(title);
            textContent.appendChild(description);

            const thumbnailsWrapper = document.createElement("div");
            thumbnailsWrapper.className = "thumbnails-wrapper";

            for (let i = 2; i <= 5; i++) {
                const photoKey = `photo${i}`;
                if (post[photoKey]) {
                    const thumbnailContainer = document.createElement("div");
                    thumbnailContainer.className = "thumbnail-container";

                    const img = document.createElement("img");
                    img.src = post[photoKey];
                    img.alt = `${post.post_title}的配图${i - 1}`;

                    thumbnailContainer.appendChild(img);
                    thumbnailsWrapper.appendChild(thumbnailContainer);
                }
            }

            topicBox.appendChild(textContent);
            if (thumbnailsWrapper.children.length > 0) {
                topicBox.appendChild(thumbnailsWrapper);
            }

            panel.appendChild(avatar);
            panel.appendChild(name);
            panel.appendChild(topicBox);

            container.appendChild(panel);
        });
    }

    /**
     * EVENT LISTENERS
     * The code that runs when a user interacts with the page
     * */

    // when the page fully loads
    document.addEventListener("DOMContentLoaded", () => {
        setupMenu();
        initViewer();
        initJoin();
        initThumbnailLimit();
        initTopic();
        fetchGetData(
            "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/multiphotopost/",
            header
        ).then((data) => {
            if (data) {
                createTopicPanels(data);
            } else {
                console.log("No data received or error occurred");
            }
        });
    });
