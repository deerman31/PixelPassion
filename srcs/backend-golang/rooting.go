package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func helloWorldHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, World!")
}

func rooting() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/", helloWorldHandler).Methods("GET")
	return r
}