# TeamFlow Backend

Welkom bij het TeamFlow Backend project! Deze README is ontworpen om ontwikkelaars een uitgebreide handleiding te bieden om deze server-side applicatie te begrijpen, in te stellen en eraan bij te dragen.

## Inhoudsopgave

1.  [Projectoverzicht](#projectoverzicht-backend)
2.  [Technologie Stack](#technologie-stack-backend)
3.  [Aan de slag](#aan-de-slag-backend)
    *   [Vereisten](#vereisten-backend)
    *   [Installatie](#installatie-backend)
    *   [De applicatie uitvoeren](#de-applicatie-uitvoeren-backend)
    *   [Bouwen voor productie](#bouwen-voor-productie-backend)
4.  [Projectstructuur](#projectstructuur-backend)
5.  [Belangrijkste functies](#belangrijkste-functies-backend)
6.  [Overzicht van Controllers](#overzicht-van-controllers-backend)
7.  [Overzicht van Services](#overzicht-van-services-backend)
8.  [Overzicht van Repositories](#overzicht-van-repositories-backend)
9.  [Overzicht van Modellen](#overzicht-van-modellen-backend)
10. [Configuratieoverzicht](#configuratieoverzicht-backend)
    *   [`SecurityConfig.java`](#securityconfigjava)
    *   [`WebSocketConfig.java`](#websocketconfigjava)
    *   [`JwtTokenProvider.java`](#jwttokenproviderjava)
    *   [`JwtAuthenticationFilter.java`](#jwtauthenticationfilterjava)
    *   [`JwtAuthEntryPoint.java`](#jwtauthenticationentrypointjava)
    *   [`SecurityBeansConfig.java`](#securitybeansconfigjava)
    *   [`settings.json`](#settingsjson-vscode)
    *   [`V1__merged_migrations.sql`](#v1__merged_migrationssql)
    *   [`pom.xml`](#pomxml-backend)
    *   [`MainApplication.java`](#mainapplicationjava)
11. [Database Setup](#database-setup-backend)
12. [Real-time Chat Backend](#real-time-chat-backend-backend)
13. [Data Transfer Objects (DTO's)](#data-transfer-objects-dtos-backend)
14. [Converters](#converters-backend)
15. [Utilities](#utilities-backend)
16. [Build Proces (Maven)](#build-proces-maven-backend)
17. [Bijdragen](#bijdragen-backend)

## 1. Projectoverzicht <a name="projectoverzicht-backend"></a>

TeamFlow Backend is de server-side component van de TeamFlow applicatie, die de REST API en WebSocket endpoints levert waarmee de frontend applicatie interageert. Het behandelt data persistentie, business logica, beveiliging, en real-time communicatie voor teamsamenwerking en projectmanagement functies. Gebouwd met behulp van Java en Spring Boot, is het ontworpen voor schaalbaarheid, onderhoudbaarheid en robuuste prestaties.

## 2. Technologie Stack <a name="technologie-stack-backend"></a>

Deze backend applicatie is gebouwd met behulp van de volgende technologieën:

*   **Java:** Programmeertaal voor het bouwen van de applicatie. Versie 21 wordt aanbevolen.
*   **Spring Boot:** Framework voor het bouwen van stand-alone, productieklare Spring-gebaseerde applicaties. Versie 3.2.0 wordt gebruikt.
*   **Spring Security:** Framework voor het bieden van authenticatie en autorisatie.
*   **Spring Data JPA:** Vereenvoudigt data toegang met behulp van Java Persistence API met Spring.
*   **WebSocket & STOMP:** Voor real-time bidirectionele communicatie, die de chatfunctionaliteit aandrijft.
*   **H2 Database:** In-memory database voor ontwikkeling en testen.
*   **Flyway:** Voor database migratie management.
*   **Maven:** Build automatisering tool voor Java projecten.
*   **JWT (JSON Web Tokens):** Voor veilige authenticatie en autorisatie.
*   **Lombok:** Java library om boilerplate code te verminderen met behulp van annotaties.

## 3. Aan de slag <a name="aan-de-slag-backend"></a>

Volg deze stappen om de TeamFlow Backend applicatie in te stellen en uit te voeren in je lokale ontwikkelomgeving.

### Vereisten <a name="vereisten-backend"></a>

Voordat je begint, zorg ervoor dat je het volgende hebt geïnstalleerd:

*   **Java Development Kit (JDK):** Versie 21 of hoger wordt aanbevolen. Je kunt het downloaden van [Oracle Java Downloads](https://www.oracle.com/java/technologies/downloads/) of [OpenJDK](https://openjdk.java.net/projects/jdk/).
*   **Maven:** Build management tool. Je kunt het downloaden van [Apache Maven](https://maven.apache.org/download.cgi).

### Installatie <a name="installatie-backend"></a>

1.  **Clone de repository:**
    ```bash
    git clone https://github.com/alex24106429/teamflow-backend
    cd scrumchat-backend
    ```

2.  **Build het project met behulp van Maven:**
    ```bash
    mvn clean install
    ```
    Dit commando downloadt alle dependencies en compileert het project.

### De applicatie uitvoeren <a name="de-applicatie-uitvoeren-backend"></a>

1.  **Navigeer naar de project root directory `teamflow/backend` in je terminal.**

2.  **Voer de Spring Boot applicatie:**
    ```bash
    mvn spring-boot:run
    ```
    Dit commando start de Spring Boot applicatie, die standaard toegankelijk zal zijn op `http://localhost:51378`. De backend API endpoints zullen beschikbaar zijn onder deze basis URL.

### Bouwen voor productie <a name="bouwen-voor-productie-backend"></a>

Om een productieklare JAR file te bouwen voor deployment:

1.  **Navigeer naar de project root directory `teamflow/backend` in je terminal.**

2.  **Voer het Maven build commando uit:**
    ```bash
    mvn clean package
    ```

    Dit commando compileert de applicatie, voert tests uit, en packt de applicatie in een uitvoerbare JAR file die zich bevindt in de `target` directory, meestal genaamd `teamflow-0.0.1-SNAPSHOT.jar`. Je kunt deze JAR file vervolgens deployen naar een server omgeving.

## 4. Projectstructuur <a name="projectstructuur-backend"></a>

Het backend project is gestructureerd met behulp van Maven's standaard directory layout en packages georganiseerd per functionaliteit:

```
teamflow/backend/
├── .mvn/                 # Maven Wrapper configuratie
├── .vscode/               # VSCode specifieke instellingen
├── data/                  # Directory voor data, JWT keys, database bestanden (H2)
├── src/
│   ├── main/
│   │   ├── java/com/teamflow/
│   │   │   ├── config/         # Beveiligings- en WebSocket configuraties
│   │   │   │   ├── JwtAuthEntryPoint.java     # Entry point voor JWT authenticatie mislukkingen
│   │   │   │   ├── JwtAuthenticationFilter.java # Filter om JWT in requests te authenticeren
│   │   │   │   ├── JwtTokenProvider.java      # Utility om JWT tokens te genereren en valideren
│   │   │   │   ├── SecurityBeansConfig.java   # Configuratie voor beveiligings gerelateerde beans (PasswordEncoder)
│   │   │   │   ├── SecurityConfig.java        # Hoofd Spring Security configuratie
│   │   │   │   ├── WebSocketConfig.java       # WebSocket configuratie
│   │   │   ├── controller/     # REST controllers voor het afhandelen van API requests
│   │   │   │   ├── AuthController.java        # Authenticatie en Registratie endpoints
│   │   │   │   ├── EpicController.java        # Endpoints voor het beheren van Epics
│   │   │   │   ├── MessageController.java     # Endpoints en WebSocket handlers voor Berichten/Chat
│   │   │   │   ├── SprintController.java      # Endpoints voor het beheren van Sprints
│   │   │   │   ├── TaskController.java        # Endpoints voor het beheren van Tasks
│   │   │   │   ├── TeamController.java        # Endpoints voor het beheren van Teams
│   │   │   │   ├── UserStoryController.java   # Endpoints voor het beheren van UserStories
│   │   │   ├── converter/      # JPA Attribute Converters
│   │   │   │   ├── MessageContentConverter.java# Converter voor MessageContent entity attribuut
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── CreateSprintDto.java       # DTO voor het creëren van Sprint objecten
│   │   │   │   ├── MessageDto.java            # DTO voor Message objecten
│   │   │   │   ├── SprintDto.java             # DTO voor Sprint objecten
│   │   │   │   ├── TeamDto.java               # DTO voor Team objecten
│   │   │   │   ├── UserDto.java               # DTO voor User objecten
│   │   │   ├── model/          # JPA Entities (Datamodellen)
│   │   │   │   ├── Epic.java                  # Entity voor Epic
│   │   │   │   ├── Message.java               # Entity voor Message
│   │   │   │   ├── MessageContent.java        # Embeddable voor Message Content
│   │   │   │   ├── Role.java                  # Entity voor User Roles
│   │   │   │   ├── Sprint.java                # Entity voor Sprint
│   │   │   │   ├── Task.java                  # Entity voor Task
│   │   │   │   ├── Team.java                  # Entity voor Team
│   │   │   │   ├── User.java                  # Entity voor User
│   │   │   │   ├── UserStory.java             # Entity voor UserStory
│   │   │   ├── repository/     # Spring Data JPA Repositories
│   │   │   │   ├── EpicRepository.java        # Repository voor Epic entities
│   │   │   │   ├── MessageRepository.java     # Repository voor Message entities
│   │   │   │   ├── RoleRepository.java        # Repository voor Role entities
│   │   │   │   ├── SprintRepository.java      # Repository voor Sprint entities
│   │   │   │   ├── TaskRepository.java        # Repository voor Task entities
│   │   │   │   ├── TeamRepository.java        # Repository voor Team entities
│   │   │   │   ├── UserRepository.java        # Repository voor User entities
│   │   │   │   ├── UserStoryRepository.java   # Repository voor UserStory entities
│   │   │   ├── service/        # Business Logica Services
│   │   │   │   ├── EpicService.java           # Service voor Epic gerelateerde operaties
│   │   │   │   ├── EpicServiceImpl.java       # Implementatie voor EpicService (indien interface bestaat)
│   │   │   │   ├── MessageService.java        # Service voor Message gerelateerde operaties
│   │   │   │   ├── MessageServiceImpl.java    # Implementatie voor MessageService
│   │   │   │   ├── SprintService.java         # Service voor Sprint gerelateerde operaties
│   │   │   │   ├── SprintServiceImpl.java     # Implementatie voor SprintService
│   │   │   │   ├── TaskService.java           # Service voor Task gerelateerde operaties
│   │   │   │   ├── TaskServiceImpl.java       # Implementatie voor TaskService (indien interface bestaat)
│   │   │   │   ├── TeamService.java           # Service voor Team gerelateerde operaties
│   │   │   │   ├── UserDetailsService.java    # (Mogelijk, indien interface afzonderlijk bestaat)
│   │   │   │   ├── UserService.java           # Service voor User gerelateerde operaties
│   │   │   │   ├── UserStoryService.java      # Service voor UserStory gerelateerde operaties
│   │   │   │   ├── UserStoryServiceImpl.java  # Implementatie voor UserStoryService (indien interface bestaat)
│   │   │   ├── util/           # Utility classes
│   │   │   │   ├── DtoConverter.java          # Utility voor het converteren van Entities naar DTO's
│   │   ├── resources/
│   │   │   ├── db/migration/   # Flyway database migratie scripts
│   │   │   │   ├── V1__merged_migrations.sql # Initieel database schema en seed data
│   │   │   ├── application.properties # Hoofd applicatie configuratie properties
│   │   │   └── web/             # (Indien statische content serveren)
│   │   └── webapp/            # (Indien legacy webapp structuur)
│   └── test/                 # Test classes
├── target/                # Build output directory
├── .gitignore             # Git ignore bestand
├── pom.xml                # Maven project definitie bestand
```

## 5. Belangrijkste functies <a name="belangrijkste-functies-backend"></a>

TeamFlow Backend biedt de volgende belangrijkste functionaliteiten:

*   **REST API Endpoints:** Voor het beheren van teams, sprints, epics, user stories en taken via HTTP requests.
*   **Gebruikersauthenticatie en -autorisatie:** Veilige gebruikerslogin, registratie en rolgebaseerde toegangscontrole met behulp van JWT.
*   **Real-time Chat Backend:** WebSocket endpoints voor het afhandelen van chatberichten binnen sprints, epics, user stories en taken.
*   **Data Persistentie:** Met behulp van JPA en H2 database voor het opslaan van applicatie data.
*   **Database Migraties:** Met behulp van Flyway voor het beheren van database schema wijzigingen.
*   **API Documentatie:** (Impliciet via REST controllers, kan worden verbeterd met Swagger/OpenAPI).

## 6. Overzicht van Controllers <a name="overzicht-van-controllers-backend"></a>

Controllers handelen inkomende HTTP requests en WebSocket berichten af, delegeren business logica naar services en retourneren responses.

*   **`AuthController.java`:**
    *   `/api/login` (POST): Handelt gebruikerslogin af, authenticeert gebruikerscredentials, en retourneert een JWT token bij succesvolle authenticatie.
    *   `/api/register` (POST): Handelt gebruikersregistratie af, creëert een nieuwe gebruiker, en retourneert een JWT token na succesvolle registratie.
*   **`TeamController.java`:**
    *   `/api/teams` (POST): Creëert een nieuw team.
    *   `/api/teams/{teamId}` (GET): Haalt een specifiek team op per ID.
    *   `/api/teams` (GET): Haalt alle teams op.
*   **`SprintController.java`:**
    *   `/api/sprints/start` (POST): Start een nieuwe sprint voor een team.
    *   `/api/sprints/{sprintId}/stop` (POST): Stopt een actieve sprint.
    *   `/api/sprints/{sprintId}` (PUT): Update de naam van een sprint.
    *   `/api/sprints/{sprintId}/dates` (PUT): Update de start- en einddatums van een sprint.
    *   `/api/sprints/{sprintId}` (DELETE): Verwijdert een sprint.
    *   `/api/sprints/teams/{teamId}/sprints` (GET): Haalt alle sprints op voor een gegeven team ID.
*   **`EpicController.java`:**
    *   `/api/epics` (POST): Creëert een nieuwe epic voor een team.
    *   `/api/epics/{id}` (GET): Haalt een epic op per ID.
    *   `/api/epics` (GET): Haalt alle epics op voor een gegeven team ID (via query parameter `teamId`).
    *   `/api/epics/{id}` (PUT): Update een epic.
    *   `/api/epics/{id}` (DELETE): Verwijdert een epic.
*   **`UserStoryController.java`:**
    *   `/api/user-stories` (POST): Creëert een nieuwe user story voor een epic.
    *   `/api/user-stories/{id}` (GET): Haalt een user story op per ID.
    *   `/api/user-stories` (GET): Haalt alle user stories op voor een gegeven epic ID (via query parameter `epicId`).
    *   `/api/user-stories/{id}` (PUT): Update een user story.
    *   `/api/user-stories/{id}` (DELETE): Verwijdert een user story.
*   **`TaskController.java`:**
    *   `/api/tasks` (POST): Creëert een nieuwe taak voor een user story.
    *   `/api/tasks/{id}` (GET): Haalt een taak op per ID.
    *   `/api/tasks` (GET): Haalt alle taken op voor een gegeven user story ID (via query parameter `userStoryId`).
    *   `/api/tasks/{id}` (PUT): Update een taak.
    *   `/api/tasks/{id}` (DELETE): Verwijdert een taak.
*   **`MessageController.java`:**
    *   `/api/sprints/{sprintId}/messages` (GET): Haalt berichten op voor een sprint.
    *   `/api/epics/{epicId}/messages` (GET): Haalt berichten op voor een epic.
    *   `/api/user-stories/{userStoryId}/messages` (GET): Haalt berichten op voor een user story.
    *   `/api/tasks/{taskId}/messages` (GET): Haalt berichten op voor een taak.
    *   WebSocket Message Handlers:
        *   `/app/chat/sprint/{sprintId}`: Handelt inkomende chatberichten af voor sprints.
        *   `/app/chat/epic/{epicId}`: Handelt inkomende chatberichten af voor epics.
        *   `/app/chat/user-story/{userStoryId}`: Handelt inkomende chatberichten af voor user stories.
        *   `/app/chat/task/{taskId}`: Handelt inkomende chatberichten af voor taken.

## 7. Overzicht van Services <a name="overzicht-van-services-backend"></a>

Services bevatten de business logica van de applicatie, handelen data verwerking en interacties met repositories af.

*   **`UserService.java`:**
    *   `loadUserByUsername(String username)`: Implementeert Spring Security's `UserDetailsService` om gebruikersdetails te laden voor authenticatie.
    *   `createUser(String username, String password)`: Creëert een nieuwe gebruiker, encodeert het wachtwoord, en wijst standaard rollen toe.
    *   `getUserByUsername(String username)`: Haalt een gebruiker op per gebruikersnaam.
*   **`TeamService.java`:**
    *   `createTeam(Team team, User creator)`: Creëert een nieuw team en voegt de maker toe als lid.
    *   `addMemberToTeam(UUID teamId, User user)`: Voegt een gebruiker toe als lid aan een team.
    *   `getTeamById(UUID teamId)`: Haalt een team op per ID.
    *   `getAllTeams()`: Haalt alle teams op.
*   **`SprintService.java`:**
    *   `startSprint(UUID teamId, String name, LocalDateTime startDate, LocalDateTime endDate)`: Start een nieuwe sprint voor een team.
    *   `stopSprint(UUID sprintId)`: Stopt een actieve sprint.
    *   `updateSprint(UUID sprintId, String name)`: Update sprint naam.
    *   `updateSprintDates(UUID sprintId, LocalDateTime startDate, LocalDateTime endDate)`: Update sprint start- en einddatums.
    *   `deleteSprint(UUID sprintId)`: Verwijdert een sprint.
    *   `getSprintsByTeamId(UUID teamId)`: Haalt sprints op voor een team.
    *   `getSprintById(UUID sprintId)`: Haalt een sprint op per ID.
*   **`EpicService.java`:**
    *   `createEpic(Epic epic, UUID teamId)`: Creëert een nieuwe epic voor een team.
    *   `getEpicById(UUID id)`: Haalt een epic op per ID.
    *   `getAllEpicsByTeamId(UUID teamId)`: Haalt alle epics op voor een team.
    *   `updateEpic(UUID id, Epic updatedEpic)`: Update een epic.
    *   `deleteEpic(UUID id)`: Verwijdert een epic.
*   **`UserStoryService.java`:**
    *   `createUserStory(UserStory userStory, UUID epicId)`: Creëert een nieuwe user story voor een epic.
    *   `getUserStoryById(UUID id)`: Haalt een user story op per ID.
    *   `getAllUserStoriesByEpicId(UUID epicId)`: Haalt alle user stories op voor een epic.
    *   `updateUserStory(UUID id, UserStory updatedUserStory)`: Update een user story.
    *   `deleteUserStory(UUID id)`: Verwijdert een user story.
*   **`TaskService.java`:**
    *   `createTask(Task task, UUID userStoryId)`: Creëert een nieuwe taak voor een user story.
    *   `getTaskById(UUID id)`: Haalt een taak op per ID.
    *   `getAllTasksByUserStoryId(UUID userStoryId)`: Haalt alle taken op voor een user story.
    *   `updateTask(UUID id, Task updatedTask)`: Update een taak.
    *   `deleteTask(UUID id)`: Verwijdert een taak.
*   **`MessageService.java` & `MessageServiceImpl.java`:**
    *   `findBySprintId(UUID sprintId)`: Haalt berichten op voor een sprint.
    *   `findByEpicId(UUID epicId)`: Haalt berichten op voor een epic.
    *   `findByUserStoryId(UUID userStoryId)`: Haalt berichten op voor een user story.
    *   `findByTaskId(UUID taskId)`: Haalt berichten op voor een taak.
    *   `saveMessage(Message message)`: Slaat een nieuw bericht op.
    *   `getMessageById(UUID id)`: Haalt een bericht op per ID.

## 8. Overzicht van Repositories <a name="overzicht-van-repositories-backend"></a>

Repositories breiden Spring Data JPA's `JpaRepository` uit om data toegangsmethoden te bieden voor elke entity.

*   **`UserRepository.java`:** Voor `User` entity, bevat methode `findByUsername(String username)` om gebruikers te vinden op gebruikersnaam.
*   **`TeamRepository.java`:** Voor `Team` entity, basis JPA operaties zijn beschikbaar.
*   **`SprintRepository.java`:** Voor `Sprint` entity, bevat methode `findByTeam_Id(UUID teamId)` om sprints te vinden op team ID.
*   **`EpicRepository.java`:** Voor `Epic` entity, basis JPA operaties.
*   **`UserStoryRepository.java`:** Voor `UserStory` entity, basis JPA operaties.
*   **`TaskRepository.java`:** Voor `Task` entity, basis JPA operaties.
*   **`MessageRepository.java`:** Voor `Message` entity, bevat methoden om berichten te vinden op sprint, epic, user story en taak ID's.
*   **`RoleRepository.java`:** Voor `Role` entity, bevat methode `findByName(Role.RoleName name)` om rollen te vinden op naam.

Deze repositories vereenvoudigen database interacties, waardoor services CRUD operaties kunnen uitvoeren zonder boilerplate code te schrijven.

## 9. Overzicht van Modellen <a name="overzicht-van-modellen-backend"></a>

Modellen vertegenwoordigen de data entities en zijn gemapt naar database tabellen met behulp van JPA annotaties.

*   **`Team.java`:** Vertegenwoordigt een team, bevat `id`, `name`, `currentSprintId`, `epics` (lijst van epics), en `members` (lijst van gebruikers).
*   **`Sprint.java`:** Vertegenwoordigt een sprint, bevat `id`, `name`, `startDate`, `endDate`, `archivePath`, `active`, en `team` (referentie naar `Team`).
*   **`User.java`:** Vertegenwoordigt een gebruiker, bevat `id`, `username`, `password`, beveiligingsgerelateerde boolean vlaggen (enabled, accountNonExpired, etc.), `roles` (collectie van rollen), en `teams` (lijst van teams waar de gebruiker lid van is).
*   **`Role.java`:** Vertegenwoordigt een gebruikersrol, bevat `id` en `name` (enum `RoleName` - `ROLE_USER`, `ROLE_ADMIN`, etc.).
*   **`Epic.java`:** Vertegenwoordigt een epic, bevat `id`, `name`, `description`, `team` (referentie naar `Team`), en `userStories` (lijst van user stories).
*   **`UserStory.java`:** Vertegenwoordigt een user story, bevat `id`, `name`, `description`, `status`, `epic` (referentie naar `Epic`), en `tasks` (lijst van taken).
*   **`Task.java`:** Vertegenwoordigt een taak, bevat `id`, `name`, `description`, `status` (enum `TaskStatus` - `TODO`, `IN_PROGRESS`, `DONE`), en `userStory` (referentie naar `UserStory`).
*   **`Message.java`:** Vertegenwoordigt een chatbericht, bevat `id`, `content` (met behulp van `MessageContentConverter`), `sender` (referentie naar `User`), en optionele referenties naar `Sprint`, `Epic`, `UserStory`, en `Task` om berichten te associëren met specifieke contexten.
*   **`MessageContent.java`:** Vertegenwoordigt de inhoud van een bericht als een simpele POJO, gebruikt met `MessageContentConverter` om berichtinhoud op te slaan als een String in de database.

Modellen zijn geannoteerd met JPA annotaties om entity mappings, relaties en database kolom definities te definiëren. Lombok annotaties zoals `@Data` worden gebruikt om boilerplate code te verminderen voor getters, setters, constructors, etc.

## 10. Configuratieoverzicht <a name="configuratieoverzicht-backend"></a>

Belangrijke configuratiebestanden en classes beheren applicatie instellingen, beveiliging, en WebSocket functionaliteit.

### `SecurityConfig.java` <a name="securityconfigjava"></a>

*   Hoofd Spring Security configuratie class.
*   Definieert de security filter chain, inclusief:
    *   Uitschakelen van CSRF bescherming.
    *   Configureren van session management om stateless te zijn (voor JWT).
    *   Instellen van het authenticatie entry point (`JwtAuthEntryPoint`) voor ongeautoriseerde requests.
    *   Autoriseren van HTTP requests:
        *   `/api/login`, `/api/register`, `/app/**`, `/h2-console/**`, `/chat/**` zijn toegestaan voor iedereen.
        *   `/api/**` vereist authenticatie.
        *   Alle andere requests vereisen authenticatie.
    *   Inschakelen van CORS (Cross-Origin Resource Sharing) om requests toe te staan van `http://localhost:5173`.
    *   Toevoegen van de `JwtAuthenticationFilter` voor `UsernamePasswordAuthenticationFilter` om JWT tokens te onderscheppen en authenticeren.
    *   Inschakelen van frame opties voor de H2 console om toegang binnen frames toe te staan.
*   Definieert beans voor `AuthenticationManager` en `CorsConfigurationSource`.
*   Configureert resource handlers en view controllers voor het serveren van statische content van `/app/**`.

### `WebSocketConfig.java` <a name="websocketconfigjava"></a>

*   Configureert WebSocket message broker.
*   `registerStompEndpoints(StompEndpointRegistry registry)`: Registreert het `/chat` endpoint voor WebSocket verbindingen, staat origins toe van `http://localhost:5173` en schakelt SockJS fallback in.
*   `configureMessageBroker(MessageBrokerRegistry registry)`: Schakelt een simple message broker in voor `/topic` bestemmingen en stelt applicatie bestemmings prefixes in op `/app`.
*   `configureClientInboundChannel(ChannelRegistration registration)`: Onderschept inkomende berichten op het client channel om WebSocket verbindingen te authenticeren met behulp van JWT tokens uit de `Authorization` header. Het valideert het token met behulp van `JwtTokenProvider` en stelt de user principal in de `StompHeaderAccessor`.

### `JwtTokenProvider.java` <a name="jwttokenproviderjava"></a>

*   Utility class voor het genereren en valideren van JWT tokens.
*   Laadt of genereert een secret key voor het ondertekenen van JWT's, slaat het op in een bestand (`data/jwt.key`).
*   `generateToken(Authentication authentication)`: Genereert een JWT token voor een gegeven authenticatie object.
*   `getAuthentication(String token)`: Extraheert authenticatie informatie uit een JWT token.
*   `getUsernameFromToken(String token)`: Extraheert de gebruikersnaam uit een JWT token.
*   `validateToken(String token)`: Valideert een JWT token, controleert op vervaldatum, misvorming, etc.

### `JwtAuthenticationFilter.java` <a name="jwtauthenticationfilterjava"></a>

*   Filter dat HTTP requests onderschept om gebruikers te authenticeren op basis van JWT tokens.
*   `doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)`:
    *   Haalt het JWT token op uit de `Authorization` header.
    *   Valideert het token met behulp van `JwtTokenProvider`.
    *   Als het token geldig is, extraheert het de gebruikersnaam, laadt gebruikersdetails met behulp van `UserDetailsService`, creëert een `Authentication` object, en stelt het in de `SecurityContextHolder`, waardoor de gebruiker effectief wordt geauthenticeerd voor de huidige request.

### `JwtAuthEntryPoint.java` <a name="jwtauthenticationentrypointjava"></a>

*   Authenticatie entry point dat ongeautoriseerde requests afhandelt.
*   `commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)`:
    *   Logt authenticatie mislukkingen.
    *   Stelt de response status in op 401 Unauthorized.
    *   Schrijft een JSON error response met timestamp, status, error, bericht, en request path.

### `SecurityBeansConfig.java` <a name="securitybeansconfigjava"></a>

*   Configuratie class om beveiligingsgerelateerde beans te definiëren.
*   `passwordEncoder()`: Definieert een `BCryptPasswordEncoder` bean voor wachtwoord hashing.

### `settings.json` (VSCode) <a name="settingsjson-vscode"></a>

*   VSCode specifieke instellingen voor het project.
    *   `"java.compile.nullAnalysis.mode": "disabled"`: Schakelt null analyse uit tijdens Java compilatie in VSCode.
    *   `"java.configuration.updateBuildConfiguration": "interactive"`: Stelt VSCode's Java build configuratie update modus in op interactief.

Deze instellingen zijn IDE-specifiek en hebben mogelijk geen invloed op de build of runtime gedrag van de applicatie buiten VSCode.

### `V1__merged_migrations.sql` <a name="v1__merged_migrationssql"></a>

*   Flyway database migratie script (versie 1).
*   Creëert database tabellen indien ze niet bestaan: `team`, `sprint`, `users`, `role`, `user_roles`, `epics`, `user_stories`, `tasks`, `message`.
*   Definieert primary keys, foreign keys, datatypes, en constraints voor elke tabel.
*   Creëert een index `idx_message_team` op de `message` tabel's `team_id` kolom.
*   Voegt initiële rollen (`ROLE_USER`, `ROLE_ADMIN`, `ROLE_PRODUCT_OWNER`, `ROLE_DEVELOPER`) in in de `role` tabel indien ze nog niet bestaan.

Dit script zet het initiële database schema en seed data op die vereist zijn voor de applicatie.

### `pom.xml` (Backend) <a name="pomxml-backend"></a>

*   Maven project definitie bestand.
*   Definieert project metadata (groupId, artifactId, version, name, description).
*   Specificeert de parent POM (`spring-boot-starter-parent`) voor Spring Boot defaults.
*   Definieert project properties, inclusief Java versie en Lombok versie.
*   **Dependencies:**
    *   `spring-boot-starter-web`: Voor het bouwen van webapplicaties met Spring MVC.
    *   `spring-boot-starter-security`: Voor Spring Security integratie.
    *   `spring-boot-starter-data-jpa`: Voor Spring Data JPA integratie.
    *   `io.jsonwebtoken:jjwt-api`, `io.jsonwebtoken:jjwt-impl`, `io.jsonwebtoken:jjwt-jackson`: JWT (JSON Web Token) libraries voor token generatie en parsing.
    *   `spring-security-messaging`: Voor Spring Security integratie met Spring Messaging (WebSocket).
    *   `org.projectlombok:lombok`: Lombok library om boilerplate code te verminderen.
    *   `spring-boot-starter-websocket`: Voor WebSocket ondersteuning.
    *   `com.h2database:h2`: H2 in-memory database.
    *   **Build Plugins:**
    *   `spring-boot-maven-plugin`: Spring Boot Maven plugin voor packaging en het uitvoeren van de applicatie.
    *   `flyway-maven-plugin`: Flyway Maven plugin voor database migraties, geconfigureerd om de H2 database te gebruiken.
    *   `maven-compiler-plugin`: Maven Compiler Plugin om Java versie en annotatie verwerking voor Lombok te configureren.

### `MainApplication.java` <a name="mainapplicationjava"></a>

*   Hoofd class van de Spring Boot applicatie.
*   Geannoteerd met `@SpringBootApplication` om Spring Boot auto-configuratie, component scanning, en configuratie properties in te schakelen.
*   Geannoteerd met `@EnableJpaAuditing` om JPA auditing functies in te schakelen (niet expliciet gebruikt in verstrekte code snippets, maar ingeschakeld).
*   Bevat de `main` methode om de Spring Boot applicatie uit te voeren met behulp van `SpringApplication.run(MainApplication.class, args)`.

Deze class bootstrapt de gehele Spring Boot applicatie.

## 11. Database Setup <a name="database-setup-backend"></a>

De backend is geconfigureerd om een H2 in-memory database te gebruiken, wat geschikt is voor ontwikkeling en testen.

*   **H2 Database:** Geconfigureerd als een runtime dependency in `pom.xml`. De database bestanden worden opgeslagen in de `./data/teamflowdb` directory vanwege Flyway configuratie.
*   **Flyway Migraties:** Flyway is geconfigureerd via `flyway-maven-plugin` in `pom.xml` om database schema migraties te beheren. De migratie scripts bevinden zich in `src/main/resources/db/migration/`. `V1__merged_migrations.sql` is het initiële migratie script dat het database schema creëert.
*   **Data Persistentie:** Spring Data JPA wordt gebruikt om te interageren met de database, waardoor data toegang wordt vereenvoudigd via repositories en JPA entities.

## 12. Real-time Chat Backend <a name="real-time-chat-backend-backend"></a>

De backend implementeert real-time chatfunctionaliteit met behulp van WebSockets en STOMP.

*   **WebSocket Configuratie:** `WebSocketConfig.java` configureert de WebSocket message broker, STOMP endpoints (`/chat`), en message handling.
*   **STOMP Protocol:** STOMP (Simple Text Oriented Messaging Protocol) wordt gebruikt over WebSockets voor berichtuitwisseling.
*   **Message Broker:** Spring's ingebouwde simple broker (`/topic`) wordt gebruikt om berichten te routeren naar geabonneerde clients.
*   **Message Handling:** `MessageController.java` handelt inkomende WebSocket berichten af via `@MessageMapping` annotaties (bijv., `/chat/sprint/{sprintId}`). Het verwerkt berichten, slaat ze op in de database met behulp van `MessageService`, en broadcast ze naar geabonneerde clients via `SimpMessagingTemplate.convertAndSend()` naar `/topic/chat/sprint/{sprintId}` topics.
*   **Authenticatie voor WebSocket:** `WebSocketConfig.java` configureert inbound channel interception om WebSocket verbindingen te authenticeren met behulp van JWT tokens, waardoor wordt verzekerd dat alleen geauthenticeerde gebruikers chatberichten kunnen verzenden en ontvangen.

## 13. Data Transfer Objects (DTO's) <a name="data-transfer-objects-dtos-backend"></a>

DTO's worden gebruikt om data over te dragen tussen lagen van de applicatie en tussen de backend en frontend, waardoor entities worden ontkoppeld van API responses.

*   **`SprintDto.java`:** DTO voor `Sprint` entity, gebruikt om sprint data bloot te stellen via API, bevat velden zoals `id`, `name`, `startDate`, `endDate`, `teamId`, etc.
*   **`TeamDto.java`:** DTO voor `Team` entity, bevat velden zoals `id`, `name`, `currentSprintId`, `epics`, en `members` (als `UserDto` lijst).
*   **`UserDto.java`:** DTO voor `User` entity, bevat velden zoals `id`, `username`, `enabled`, en `roles` (als lijst van rol namen).
*   **`MessageDto.java`:** DTO voor `Message` entity, bevat velden zoals `id`, `content`, `sender` (als `UserDto`), `sprintId`, `epicId`, `userStoryId`, `taskId`, `createdAt`, en `contextType` om de message context te specificeren (sprint, epic, etc.).
*   **`CreateSprintDto.java`:** DTO specifiek voor het creëren van nieuwe sprints, gebruikt om sprint creatie requests te accepteren, inclusief velden zoals `teamId`, `name`, `startDate`, `endDate` als Strings om date parsing af te handelen.

DTO's helpen bij het structureren van API responses, verbeteren data overdracht efficiëntie, en ontkoppelen de API van interne datamodellen.

## 14. Converters <a name="converters-backend"></a>

Converters worden gebruikt om entity attributen te transformeren naar verschillende representaties voor database opslag of ophalen.

*   **`MessageContentConverter.java`:** JPA Attribute Converter voor `MessageContent` class. Het converteert `MessageContent` objecten naar Strings bij het opslaan in de database en vice versa bij het ophalen. Dit wordt gebruikt om het `MessageContent` object's `content` veld direct in te bedden als een kolom in de `message` tabel.

Converters helpen bij het afhandelen van specifieke datatype transformaties die vereist zijn door JPA of applicatie logica.

## 15. Utilities <a name="utilities-backend"></a>

Utility classes bieden helper functies en algemene functionaliteiten.

*   **`DtoConverter.java`:** Utility class die statische methoden bevat om JPA entities te converteren naar hun corresponderende DTO's. Het bevat conversie methoden voor `User`, `Team`, en `Sprint` entities naar `UserDto`, `TeamDto`, en `SprintDto` respectievelijk, waarbij geneste conversies worden afgehandeld (bijv., het converteren van teamleden naar `UserDto` lijst binnen `TeamDto`).

Utilities helpen bij code herbruikbaarheid en houden controllers en services schoner door conversie en helper taken uit te besteden.

## 16. Build Proces (Maven) <a name="build-proces-maven-backend"></a>

Het backend project gebruikt Maven voor build automatisering.

*   **`pom.xml`:** Definieert de project's build configuratie, dependencies, plugins, etc.
*   **Build Lifecycle:** Maven's standaard build lifecycle wordt gebruikt (clean, install, package).
    *   `mvn clean install`: Maakt het project schoon, compileert code, voert tests uit, en installeert de gebouwde artifacts in de lokale Maven repository.
    *   `mvn clean package`: Packt de gecompileerde code en dependencies in een JAR file in de `target` directory.
*   **Flyway Plugin:** Geïntegreerd in het Maven build proces om database migraties toe te passen tijdens build of applicatie opstart, waardoor wordt verzekerd dat het database schema up-to-date is.

## 17. Bijdragen <a name="bijdragen-backend"></a>

Bijdragen aan TeamFlow Backend zijn welkom! Volg aub deze richtlijnen:

1.  **Fork de repository** op GitHub.
2.  **Maak een branch** voor je functie of bug fix: `git checkout -b feature/jouw-functie-naam` of `git checkout -b fix/jouw-bug-fix`.
3.  **Breng je wijzigingen aan**, houd je aan de codeerstijl en best practices van het project.
4.  **Schrijf unit en integratie tests** voor je wijzigingen.
5.  **Build en test je wijzigingen** met behulp van Maven: `mvn clean install`. Zorg ervoor dat alle tests slagen.
6.  **Commit je wijzigingen** met duidelijke en beschrijvende commit berichten.
7.  **Push je branch** naar je fork: `git push origin feature/jouw-functie-naam`.
8.  **Maak een pull request** naar de hoofd repository, waarin je je wijzigingen en hun doel uitlegt.
