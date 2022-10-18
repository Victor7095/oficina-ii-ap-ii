// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ChatU {

  // Stores the default name of an user and her friends info
  struct User {
    address pubkey;
    string name;
  }

  // message construct stores the single chat message and its metadata
  struct Message {
    address sender;
    uint256 timestamp;
    string msg;
  }

  enum SessionType{ PRIVATE, GROUP }

  struct Session {
    uint id;
    string name;
    SessionType sessionType;
  }

  // Collection of users registered on the application
  mapping(address => User) userList;

  // Collection of sessions on the application
  uint sessionCounter = 0;
  mapping(uint => Session) sessions;

  // Collection of users in a session
  mapping(uint => User[]) sessionUsers;

  // Collection of sessions of a user
  mapping(address => Session[]) userSessions;

  // Collection of messages in a session
  mapping(uint => Message[]) messages;

  event NewMessage(uint indexed sessionId, address indexed from, uint timestamp, string message);

  // It checks whether a user(identified by its public key)
  // has created an account on this application or not
  function checkUserExists(address pubkey) public view returns(bool) {
    return bytes(userList[pubkey].name).length > 0;
  }

  // Returns the default name provided by an user
  function getUsername(address pubkey) external view returns(string memory) {
    require(checkUserExists(pubkey), "User is not registered!");
    return userList[pubkey].name;
  }

  // Registers the caller(msg.sender) to our app with a non-empty username
  function createAccount(string calldata name) external {
    require(checkUserExists(msg.sender)==false, "User already exists!");
    require(bytes(name).length>0, "Username cannot be empty!"); 
    userList[msg.sender].name = name;
    userList[msg.sender].pubkey = msg.sender;
  }

  // Returns all users in a session
  function getSessionUsers(uint sessionId) external view returns(User[] memory) {
    return sessionUsers[sessionId];
  }

  // Returns all sessions of a user
  function getSessions() external view returns(Session[] memory) {
    return userSessions[msg.sender];
  }

  // Create a new session
  function createSession(string calldata name, address[] calldata newUsers, SessionType sessionType) external {
    require(checkUserExists(msg.sender), "Create an account first!");
    uint sessionId = sessionCounter++;
    Session storage session = sessions[sessionId];
    session.id = sessionId;
    session.name = name;
    session.sessionType = sessionType;

    // Adicionando usuários
    sessionUsers[sessionId].push(userList[msg.sender]);
    userSessions[msg.sender].push(session);
    for (uint i = 0; i < newUsers.length; i++) {
      require(checkUserExists(newUsers[i]), "User is not registered!");
      require(msg.sender!=newUsers[i], "Users cannot add themselves as friends!");
      sessionUsers[sessionId].push(userList[newUsers[i]]);
      userSessions[newUsers[i]].push(session);
    }
  }

  // Returns all the chat messages communicated in a session
  function getMessages(uint sessionId) external view returns(Message[] memory) {
    return messages[sessionId];
  }

  // Sends a new message to a given session
  function sendMessage(uint sessionId, string calldata _msg) external {
    require(checkUserExists(msg.sender), "Create an account first!");

    Message memory newMsg = Message(msg.sender, block.timestamp, _msg);
    messages[sessionId].push(newMsg);
    emit NewMessage(sessionId, msg.sender, block.timestamp, _msg);
  }
}