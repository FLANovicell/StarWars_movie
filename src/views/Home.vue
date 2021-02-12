<template>
  <div class="container">
    <div class="home">
      <h1>Star War's Character</h1>
      <label for="filter">Filter:</label>
      <input v-model="search" type="text" placeholder="Filter on names" />

      <div class="home__row">
        <div
          v-for="person in sortedCharacter"
          class="home__col"
          :key="person.name"
        >
          <div class="content">
            <div class="content__row--title">
              <h2>{{ person.name }}</h2>
            </div>
            <div class="content__row">
              <div class="content__row">
                <p><b>Gender: </b>{{ person.gender }}</p>
              </div>
              <div class="content__row">
                <p><b>Birth Year: </b>{{ person.birth_year }}</p>
              </div>
              <div class="content__row">
                <p><b>Hair-color: </b> {{ person.hair_color }}</p>
              </div>
              <div class="content__row">
                <p><b>Height: </b>{{ person.height }} cm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <form
      @submit.prevent="
        addCharacter(name, gender, birth_year, hair_color, height)
      "
      class="form"
      novalidate="true"
    >
      <h2>Create a character</h2>
      <p v-if="errors.length">Please correct the following error(s):</p>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>

      <div class="form__row">
        <div class="form__col">
          <label for="name">Name: </label>
        </div>
        <div class="form__col">
          <input
            id="name"
            v-model="name"
            placeholder="Mickey Mouse e.g."
            required
          />
          <div v-if="v$.name.$error">please make a name for your character</div>
        </div>
      </div>

      <div class="form__row">
        <div class="form__col">
          <label for="gender">Gender: </label>
        </div>
        <div class="form__col">
          <select id="gender" name="gender" v-model="gender" required>
            <option vlaue="female">Female</option>
            <option value="male">Male</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      <div class="form__row">
        <div class="form__col">
          <label for="birth_year">Birth Year: </label>
        </div>
        <div class="form__col">
          <input type="text" v-model="birth_year" placeholder="24BBY e.g." />
        </div>
      </div>

      <div class="form__row">
        <div class="form__col">
          <label for="hair_color">Hair Color: </label>
        </div>
        <div class="form__col">
          <input type="text" v-model="hair_color" placeholder="Pink e.g." />
        </div>
      </div>
      <div class="form__row">
        <div class="form__col">
          <label for="height">Height: </label>
        </div>
        <div class="form__col">
          <input
            min="0"
            type="number"
            v-model="height"
            placeholder="The unit is in cm"
          />
          cm
        </div>
      </div>

      <button class="form__button">Create</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "Home",
  setup() {
    return { v$: useVuelidate };
  },
  data() {
    return {
      errors: [],
      search: "",
      people: [],
      name: "",
      gender: "",
      birth_year: "",
      hair_color: "",
      height: "",
    };
  },
  mounted() {
    if (localStorage.getItem("people")) {
      this.getCharacterFromStorage();
    } else {
      this.getAllPeople();
    }
  },
  methods: {
    getAllPeople() {
      axios
        .get("https://swapi.dev/api/people/?page=1")
        .then((response) => {
          console.log(response);
          this.people = response.data.results;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    addCharacter() {
      this.people.push({
        name: this.name,
        gender: this.gender,
        birth_year: this.birth_year,
        hair_color: this.hair_color,
        height: this.height,
      });

      localStorage.setItem("people", JSON.stringify(this.people));

      this.name = "";
      this.gender = "";
      this.birth_year = "";
      this.hair_color = "";
      this.height = "";
    },

    getCharacterFromStorage() {
      this.people = JSON.parse(localStorage.getItem("people"));
    },
  },
  computed: {
    listOfCharacter() {
      console.log("list of character", this.people);
      return this.people;
    },

    /*filter and sorting the poeple  */
    sortedCharacter() {
      function compare(a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
        if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
        return 0;
      }

      return [...this.people].sort(compare).filter((people) => {
        return people.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  validations: {
    name: {
      required,
    },
    gender: {
      required,
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: auto;
  justify-items: center;
  justify-content: center;
  justify-self: center;
}
.home {
  h1 {
    color: rgb(255, 238, 0);
  }
  font-family: "Press Start 2P", cursive;

  &__col {
    width: 40%;
    display: inline-flex;
    margin: 15px;
    &:hover {
      background-color: rgb(255, 238, 0);
    }
  }

  .content {
    width: 100%;
    &__row {
      width: 100%;
    }
    &__row--title {
      font-size: 0.5em;
      background-color: rgba(255, 238, 0, 0.425);
      padding: 5px;
      @media (min-width: 768px) {
        font-size: 1em;
      }
    }
  }

  input {
    border-style: none;
    border-radius: 10px;
    height: 20px;
    padding: 10px;
    margin: 10px;
    box-shadow: 3px 3px rgba(0, 0, 0, 0.25);

    &:focus {
      outline: none;
      box-shadow: 3px 3px rgba(22, 185, 0, 0.5);
    }
  }
}

/*FORM*/
.form {
  padding: 10px;
  font-family: "Press Start 2P", cursive;
  background-color: rgba(255, 238, 0, 0.425);
  font-size: 0.8em;
  @media (min-width: 768px) {
    font-size: 1em;
  }

  &:hover {
    background-color: rgb(255, 238, 0);
  }

  &__row {
    margin: 5px;
  }

  &__col {
    width: 44%;
    display: inline-flex;
    & label {
      font-weight: bold;
    }
  }
  &__container {
    display: flex;
  }
  &__button {
    margin-top: 20px;
    font-family: "Press start 2P", cursive;
    border-style: none;
    padding: 10px;
    font-size: 1.5em;
    border-radius: 15px;
    background-color: rgb(20, 71, 54);
    color: #fff;
    box-shadow: 2px 2px rgb(66, 66, 66);
    text-shadow: 2px 2px darkslategray;

    &:hover {
      background-color: rgb(13, 124, 87);
    }
  }

  input {
    border-style: none;
    border-radius: 10px;
    height: 20px;
    padding: 10px;
    margin: 10px;
    box-shadow: 3px 3px rgba(0, 0, 0, 0.25);
    width: 140px;

    &:focus {
      outline: none;
      box-shadow: 3px 3px rgba(22, 185, 0, 0.5);
    }
    @media (min-width: 768px) {
      width: 80%;
    }
  }
  select {
    border-radius: 10px;
    border-style: none;
    height: 33px;
    padding: 10px;
    box-shadow: 3px 3px rgba(0, 0, 0, 0.25);
    margin: 10px;
    width: 85%;
    &:focus {
      outline: none;
      box-shadow: 3px 3px rgba(22, 185, 0, 0.5);
    }
  }
}
</style>
