// ==================================================
// OPPORTUNA
// Search + Filters + Saved Opportunities + LocalStorage
// ==================================================


// ================= ELEMENTS =================

const searchInput =
  document.getElementById("searchInput");

const searchButton =
  document.getElementById("searchButton");

const opportunityCards =
  document.querySelectorAll(".opportunity-card");

const filterButtons =
  document.querySelectorAll(".filter");

const resultsCount =
  document.getElementById("resultsCount");

const resetButton =
  document.getElementById("resetSearch");

const noResults =
  document.getElementById("noResults");

const savedContainer =
  document.getElementById("savedContainer");

const savedTotal =
  document.getElementById("savedTotal");


// ================= STORAGE =================

let savedOpportunities =
  JSON.parse(
    localStorage.getItem("opportunaSaved")
  ) || [];


// ================= CURRENT FILTER =================

let currentFilter = "all";


// ================= CREATE ID =================

function getOpportunityId(card) {

  return card.dataset.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

}


// ================= SAVE STORAGE =================

function saveToStorage() {

  localStorage.setItem(
    "opportunaSaved",
    JSON.stringify(savedOpportunities)
  );

}


// ================= UPDATE SAVED COUNT =================

function updateSavedCount() {

  const count =
    savedOpportunities.length;

  savedTotal.textContent =
    count +
    (count === 1 ? " saved" : " saved");

}


// ================= UPDATE HEARTS =================

function updateHeartStates() {

  opportunityCards.forEach(function(card) {

    const button =
      card.querySelector(".save-btn");

    const id =
      getOpportunityId(card);


    if (savedOpportunities.includes(id)) {

      button.textContent = "♥";

      button.classList.add("saved");

      button.setAttribute(
        "aria-label",
        "Remove saved opportunity"
      );

    } else {

      button.textContent = "♡";

      button.classList.remove("saved");

      button.setAttribute(
        "aria-label",
        "Save opportunity"
      );

    }

  });

}


// ================= SAVE / UNSAVE =================

opportunityCards.forEach(function(card) {

  const button =
    card.querySelector(".save-btn");

  const id =
    getOpportunityId(card);


  button.addEventListener(
    "click",
    function() {

      if (
        savedOpportunities.includes(id)
      ) {

        savedOpportunities =
          savedOpportunities.filter(
            function(item) {
              return item !== id;
            }
          );

      } else {

        savedOpportunities.push(id);

      }


      saveToStorage();

      updateSavedCount();

      updateHeartStates();

      renderSavedOpportunities();

    }
  );

});


// ================= SEARCH =================

function performSearch() {

  const keyword =
    searchInput.value
      .toLowerCase()
      .trim();


  let visibleCount = 0;


  opportunityCards.forEach(function(card) {

    const title =
      card.dataset.title.toLowerCase();

    const category =
      card.dataset.category.toLowerCase();

    const location =
      card.dataset.location.toLowerCase();

    const type =
      card.dataset.type.toLowerCase();

    const organization =
      card
        .querySelector(".organization")
        .textContent
        .toLowerCase();


    const searchableText =
      title +
      " " +
      category +
      " " +
      location +
      " " +
      type +
      " " +
      organization;


    const keywordMatch =
      keyword === "" ||
      searchableText.includes(keyword);


    const filterMatch =
      currentFilter === "all" ||
      category === currentFilter;


    if (
      keywordMatch &&
      filterMatch
    ) {

      card.style.display = "";

      visibleCount++;

    } else {

      card.style.display = "none";

    }

  });


  resultsCount.textContent =
    visibleCount +
    (
      visibleCount === 1
        ? " opportunity"
        : " opportunities"
    );


  if (visibleCount === 0) {

    noResults.classList.remove("hidden");

  } else {

    noResults.classList.add("hidden");

  }

}


// ================= SEARCH BUTTON =================

searchButton.addEventListener(
  "click",
  performSearch
);


// ================= ENTER KEY =================

searchInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      performSearch();

    }

  }
);


// ================= FILTERS =================

filterButtons.forEach(function(button) {

  button.addEventListener(
    "click",
    function() {


      filterButtons.forEach(
        function(btn) {

          btn.classList.remove(
            "active"
          );

        }
      );


      button.classList.add("active");


      currentFilter =
        button.dataset.filter;


      performSearch();

    }
  );

});


// ================= RESET =================

resetButton.addEventListener(
  "click",
  function() {

    searchInput.value = "";

    currentFilter = "all";


    filterButtons.forEach(
      function(button) {

        button.classList.remove(
          "active"
        );

      }
    );


    document
      .querySelector(
        '.filter[data-filter="all"]'
      )
      .classList.add("active");


    performSearch();

  }
);


// ================= POPULAR TAGS =================

const popularTags =
  document.querySelectorAll(
    ".popular-tag"
  );


popularTags.forEach(function(tag) {

  tag.addEventListener(
    "click",
    function() {

      searchInput.value =
        tag.dataset.search;


      performSearch();


      document
        .getElementById("explore")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

});


// ================= RENDER SAVED =================

function renderSavedOpportunities() {

  savedContainer.innerHTML = "";


  if (
    savedOpportunities.length === 0
  ) {

    savedContainer.innerHTML = `

      <div class="empty-saved">

        <div class="empty-saved-icon">
          ♡
        </div>

        <h3>
          No saved opportunities yet
        </h3>

        <p>
          Save opportunities you want to
          come back to later.
        </p>

      </div>

    `;

    return;

  }


  opportunityCards.forEach(
    function(card) {

      const id =
        getOpportunityId(card);


      if (
        !savedOpportunities.includes(id)
      ) {
        return;
      }


      const title =
        card.dataset.title;

      const organization =
        card
          .querySelector(".organization")
          .textContent;

      const category =
        card
          .querySelector(".category-label")
          .textContent;

      const location =
        card.dataset.location;

      const deadline =
        card
          .querySelector(".deadline strong")
          .textContent;


      const savedCard =
        document.createElement("article");


      savedCard.className =
        "saved-opportunity";


      savedCard.innerHTML = `

        <div class="saved-top">

          <span>
            ${category}
          </span>

          <button
            class="remove-saved"
            type="button"
          >
            Remove
          </button>

        </div>


        <h3>
          ${title}
        </h3>


        <p class="saved-organization">
          ${organization}
        </p>


        <div class="saved-info">

          <span>
            ${location}
          </span>

          <strong>
            ${deadline}
          </strong>

        </div>

      `;


      const removeButton =
        savedCard.querySelector(
          ".remove-saved"
        );


      removeButton.addEventListener(
        "click",
        function() {

          savedOpportunities =
            savedOpportunities.filter(
              function(item) {
                return item !== id;
              }
            );


          saveToStorage();

          updateSavedCount();

          updateHeartStates();

          renderSavedOpportunities();

        }
      );


      savedContainer.appendChild(
        savedCard
      );

    }
  );

}


// ================= INITIALIZE =================

updateSavedCount();

updateHeartStates();

renderSavedOpportunities();

performSearch();
