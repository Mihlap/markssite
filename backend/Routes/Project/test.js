{
    altitude: "65443",
    awards: "",
    constructionVolume: "23432",
    countryCity: "234",
    customer: "вапва",
    degreeParticipation: "пвапва",
    descriptionProject: "выаыва",
    dropPhoto: [
        File,
        File,
        File,
        File
    ],
    dynamicBlocks: [
        [
            {
                label: "Картинка с описанием",
                type: "file",
                value: FileList // тут есть подробности о файле, но я опустил их для краткости
            },
            {
                type: "text",
                label: "Описание картинки",
                value: "первый блок"
            }
        ],
        [
            {
                type: "text",
                label: "Заголовок",
                value: "второй блок"
            },
            {
                type: "textarea",
                label: "Текстовый блок",
                value: ""
            }
        ],
        [
            {
                label: "Слайдер *допускается загрузка 8ми изображений",
                type: "file",
                value: FileList // тут есть подробности о файле, но я опустил их для краткости
            }
        ]
    ],
    floors: "234",
    imageClose: ""
}
