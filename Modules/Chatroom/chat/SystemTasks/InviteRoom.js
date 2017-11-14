var Container	= require('../AppContainer');
var Subscriber = require('../Model/Subscriber');
var Notice = require('../Model/Messages/Notice');
var InviteAction = require('../Model/Messages/InviteAction');


module.exports = function exports(req, res)
{
	var namespaceId = req.params.namespace;
	var roomId = req.params.roomId;
	var subRoomId = req.params.subRoomId;
	var inviteeId = parseInt(req.params.invitedId, 10);
	var hostId = req.params.id;

	var namespace = Container.getNamespace(namespaceId);
	var serverRoomId = Container.createServerRoomId(roomId, subRoomId);
	var room = namespace.getRoom(serverRoomId);
	var subscriber = namespace.getSubscriber(inviteeId);

	var createNoticeEmitterForHost = function createNoticeEmitterForHost(notice) {
		return function (socketId) {
			namespace.getIO().to(socketId).emit('notice', notice);
		};
	};

	var createNoticeEmitterForInvitee = function createNoticeEmitterForInvitee(action, notice) {
		return function (socketId) {
			namespace.getIO().to(socketId).emit('user_invited', action);
			namespace.getIO().to(socketId).emit('notice', notice);
		};
	};

	Container.getLogger().info('Invite Subscriber %s to room %s of namespace %s', inviteeId, serverRoomId, namespace.getName());

	if (subscriber === null) {
		subscriber = new Subscriber(inviteeId);

		if(!namespace.hasSubscriber(subscriber.getId())) {
			namespace.addSubscriber(subscriber);
		}
	}
	room.addSubscriber(subscriber);

	if (namespace.hasSubscriber(hostId)) {
		var host = namespace.getSubscriber(hostId);

		var emitNoticeToHost = createNoticeEmitterForHost(
			Notice.create('user_invited', roomId, subRoomId)
		);
		host.getSocketIds().forEach(emitNoticeToHost);

		var emitNoticeToInvitee = createNoticeEmitterForInvitee(
			InviteAction.create(roomId, subRoomId, room.getTitle(), room.getOwnerId()),
			Notice.create('user_invited_self', roomId, -1, {user: host.getName(), room: room.getTitle()})
		);

		subscriber.getSocketIds().forEach(emitNoticeToInvitee);
	}

	res.send({
		success: true,
		subRoomId: subRoomId
	});
};
