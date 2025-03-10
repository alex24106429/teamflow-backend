# ScrumChat Backend

ScrumChat is een applicatie ontworpen om de communicatie binnen Scrum teams te faciliteren, tijdens de daily stand-up.

## Inhoudsopgave

1.  [Introductie](#introductie)
2.  [Vereisten](#vereisten)
3.  [Installatie](#installatie)
4.  [Configuratie](#configuratie)
	* [Database](#database)
	* [JWT](#jwt)
	* [WebSocket](#websocket)
	* [Server](#server)
5.  [API Endpoints](#api-endpoints)
	* [Authenticatie](#authenticatie)
	* [Teams](#teams)
	* [Sprints](#sprints)
6.  [Data Modellen](#data-modellen)
	* [User](#user)
	* [Role](#role)
	* [Team](#team)
	* [Sprint](#sprint)
	* [Message](#message)
7.  [Services](#services)
	* [TeamService](#teamservice)
	* [SprintService](#sprintservice)
	* [UserService](#userservice)
8.  [Configuratie Klassen](#configuratie-klassen)
	  * [SecurityConfig](#securityconfig)
	  * [WebSocketConfig](#websocketconfig)

## 1. Introductie <a name="introductie"></a>

De ScrumChat backend is een Spring Boot applicatie die RESTful API's en WebSocket functionaliteit biedt voor de ScrumChat applicatie.  Het maakt gebruik van een H2 in-memory database (standaard configuratie) of een persistente H2 database voor het opslaan van gegevens over gebruikers, teams, sprints en berichten.  Flyway wordt gebruikt voor database migraties.  De applicatie is ontworpen om schaalbaar en onderhoudbaar te zijn, en is nu uitgebreid met authenticatie en autorisatie functionaliteiten met behulp van Spring Security en JWT (toekomstige implementatie). WebSocket wordt gebruikt voor real-time communicatie.

## 2. Vereisten <a name="vereisten"></a>

* Java 21 of hoger
* Maven
* Een IDE (bijv. Visual Studio Code, IntelliJ IDEA)

## 3. Installatie <a name="installatie"></a>

1.  **Kloon de repository:**

	```bash
	git clone https://github.com/alex24106429/scrumchat-backend
	```

2.  **Open het project in Visual Studio Code of IntelliJ IDEA**

3.  **Run `MainApplication.java`**

	De applicatie zal standaard starten op poort 8081.

## 4. Configuratie <a name="configuratie"></a>

De applicatie wordt geconfigureerd via het `src/main/resources/application.properties` bestand. Hieronder staan de belangrijkste configuratie-opties:

### 4.1 Database <a name="database"></a>

* `spring.datasource.url`:  De JDBC URL voor de H2 database.  Standaard wordt een bestand `scrumchatdb` aangemaakt in de map `data`. Je kan ook een in-memory database gebruiken voor testdoeleinden: `jdbc:h2:mem:scrumchatdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE`.
* `spring.datasource.driver-class-name`: De JDBC driver klasse (voor H2 is dit `org.h2.Driver`).
* `spring.datasource.username`: De database gebruikersnaam (standaard `sa`).
* `spring.datasource.password`: Het database wachtwoord (standaard `password`).
* `spring.jpa.properties.hibernate.format_sql`:  Of SQL queries mooi geformatteerd moeten worden in de logs (standaard `true`).
* `spring.jpa.database-platform`:  Het database dialect (voor H2 is dit `org.hibernate.dialect.H2Dialect`).
* `spring.flyway.enabled`: Schakelt Flyway database migraties in of uit (standaard `true`).
* `spring.flyway.locations`:  De locatie van de Flyway migratie scripts (standaard `classpath:db/migration`).

### 4.2 JWT <a name="jwt"></a>

* `jwt.secret`: De geheime sleutel die wordt gebruikt voor het ondertekenen van JWT tokens (standaard `scrumchat-secret-key`).  **Wijzig deze sleutel in een productieomgeving!**
* `jwt.expiration`:  De vervaltijd van JWT tokens in milliseconden (standaard 86400000, wat overeenkomt met 24 uur of 1 dag).

### 4.3 WebSocket <a name="websocket"></a>

* `spring.websocket.allowed-origins`:  De toegestane origins voor WebSocket verbindingen (standaard `*`, wat alle origins toestaat). Beperk dit in een productieomgeving tot de specifieke origins van je frontend applicatie.

### 4.4 Server <a name="server"></a>

* `server.port`:  De poort waarop de applicatie draait (standaard 8081).

## 5. API Endpoints <a name="api-endpoints"></a>

De volgende REST API endpoints zijn beschikbaar:

### 5.1 Authenticatie <a name="authenticatie"></a>
* `POST /api/auth/register`: Registreert een nieuwe gebruiker.
    * **Request body:**
        ```json
        {
          "username": "nieuwegebruiker",
          "password": "wachtwoord"
        }
        ```
    *  **Response:** Het aangemaakte `User` object.
* `POST /api/auth/login`: Logt een gebruiker in. (Momenteel Form Login, JWT implementatie volgt)
    * **Request body:** Formulier met `username` en `password` velden.
    * **Response:** Na succesvolle login wordt een sessie gestart en wordt de gebruiker doorgeleid naar `/api/`.

### 5.2 Teams <a name="teams"></a>

* `POST /teams`: Creëert een nieuw team.
	* **Request body:**
		```json
		{
		  "name": "Teamnaam"
		}
		```
	*  **Response:** Het aangemaakte `Team` object.
* `GET /teams/{teamId}`: Haalt een team op basis van zijn ID.
	* **Path variable:** `teamId` (UUID) - De ID van het team.
	* **Response:** Het `Team` object, of een 404 Not Found als het team niet bestaat.

### 5.3 Sprints <a name="sprints"></a>

* `POST /sprints/start?teamId={teamId}`: Start een nieuwe sprint voor een bepaald team.
	* **Request parameter:** `teamId` (UUID) - De ID van het team waarvoor de sprint wordt gestart.
	* **Response:** Het aangemaakte `Sprint` object.
* `POST /sprints/{sprintId}/stop`: Stopt een actieve sprint.
	* **Path variable:** `sprintId` (UUID) - De ID van de sprint die moet worden gestopt.
	* **Response:**  Geen content (204 No Content).

**Beveiliging:**
Alle endpoints behalve `/api/auth/**` zijn beveiligd en vereisen authenticatie. Momenteel wordt Form Login gebruikt voor authenticatie. Toekomstige implementatie zal JWT (JSON Web Tokens) gebruiken voor stateless authenticatie.

## 6. Data Modellen <a name="data-modellen"></a>

De applicatie gebruikt de volgende data modellen:

### 6.1 User <a name="user"></a>

* `id` (UUID): Unieke identifier.
* `username` (String): Gebruikersnaam (unique).
* `password` (String): Wachtwoord hash van de gebruiker.
* `authorities` (Set<Role>): Set van rollen die de gebruiker heeft.
* `enabled` (Boolean): Geeft aan of de gebruiker is ingeschakeld.
* `accountNonExpired` (Boolean): Geeft aan of het account niet is verlopen.
* `credentialsNonExpired` (Boolean): Geeft aan of de credentials niet zijn verlopen.
* `accountNonLocked` (Boolean): Geeft aan of het account niet is gelocked.

### 6.2 Role <a name="role"></a>

* `id` (UUID): Unieke identifier.
* `authority` (String): Rol naam (bijv. "ROLE_USER", "ROLE_ADMIN") (unique).

### 6.3 Team <a name="team"></a>

* `id` (UUID): Unieke identifier.
* `name` (String): Naam van het team.
* `currentSprintId` (UUID): De ID van de huidige actieve sprint (kan null zijn).

### 6.4 Sprint <a name="sprint"></a>

* `id` (UUID): Unieke identifier.
* `startDate` (LocalDateTime): Startdatum en -tijd van de sprint.
* `endDate` (LocalDateTime): Einddatum en -tijd van de sprint (kan null zijn).
* `archivePath` (String): Pad naar het archief van de sprint (nog niet geïmplementeerd).
* `team` (Team): Het team waartoe de sprint behoort.

### 6.5 Message <a name="message"></a>

* `id` (UUID): Unieke identifier.
* `content` (String): Inhoud van het bericht.
* `sender` (User): De gebruiker die het bericht heeft verzonden.
* `scrumItemId` (UUID):  ID van het Scrum item waar het bericht betrekking op heeft (nog niet geïmplementeerd).
* `sprint` (Sprint): De sprint waarbinnen het bericht is verzonden.
* `timestamp` (LocalDateTime): Tijdstip van verzending.

## 7. Services <a name="services"></a>
De applicatielogica bevindt zich in de volgende services:

### 7.1 TeamService <a name="teamservice"></a>
Verantwoordelijk voor het aanmaken en ophalen van teams.
* `createTeam(Team team)`: Maakt een nieuw team aan.
* `getTeamById(UUID teamId)`: Haalt een team op op basis van ID.

### 7.2 SprintService <a name="sprintservice"></a>
Verantwoordelijk voor het starten en stoppen van sprints.
* `startSprint(UUID teamId)`: Start een nieuwe sprint voor het opgegeven team.
* `stopSprint(UUID sprintId)`: Stopt de sprint met het opgegeven ID.

### 7.3 UserService <a name="userservice"></a>
Verantwoordelijk voor gebruikersbeheer en authenticatie. Implementeert `UserDetailsService` voor Spring Security.
* `loadUserByUsername(String username)`: Laadt een gebruiker op basis van gebruikersnaam voor authenticatie.
* `registerUser(String username, String password)`: Registreert een nieuwe gebruiker.

## 8. Configuratie Klassen <a name="configuratie-klassen"></a>

### 8.1 SecurityConfig <a name="securityconfig"></a>

* Configureert Spring Security.
* Schakelt CSRF-bescherming uit.
* Stelt authenticatie in voor alle endpoints behalve `/api/auth/**`.
* Gebruikt Form Login voor authenticatie.
* Configureert `DaoAuthenticationProvider` met `UserDetailsService` en `BCryptPasswordEncoder`.

### 8.2 WebSocketConfig <a name="websocketconfig"></a>

* Configureert WebSocket functionaliteit.
* Registreert het `/ws` endpoint voor WebSocket verbindingen met SockJS fallback.
* Configureert de message broker met `/topic` voor broker bestemmingen en `/app` als prefix voor applicatie bestemmingen.