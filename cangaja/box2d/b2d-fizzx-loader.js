/**
 * @description
 *
 * CG.B2DFizzXLoader
 *
 * @class CG.B2DFizzXLoader
 * @extends CG.Class
 * @deprecated maybe it will removed in the future. FizzX editor development has stopped before it began ;-(
 */

CG.Class.extend('B2DFizzXLoader', {
    /**
     * @constructor
     * @method init
     * @param json {string}
     * @param world {CG.B2DWorld}
     * @param offsetx {Number}
     * @param offsety {Number}
     */
    init: function (json, world, offsetx, offsety) {
        /**
         @property json {string}
         */
        this.json = JSON.parse(json, function (key, value) {
            if (typeof value === "string") {
                if (value.match(/^[-+]?\d+$/)) {      //check for integer
                    return parseInt(value)
                } else if (value.match(/^[-+]?\d+\.\d+$/)) {   //check for float
                    return parseFloat(value)
                } else {      //strings
                    switch (value) {
                        case "true":
                            return true
                            break
                        case "false":
                            return false
                            break
                        case "null":
                            return null
                            break
                    }
                }
            }
            return value
        })
        /**
         @property world {CG.B2DWorld}
         */
        this.world = world
        /**
         @property offsetx {Number}
         */
        this.offsetx = offsetx
        /**
         @property offsety {Number}
         */
        this.offsety = offsety

        this.bodiesMap = []
        this.jointsMap = []
        this.imageMap = []
        this.atlasMap = []

        this.loadImages()
        this.loadBodies()
        this.loadJoints()
    },
    /**
     * @description
     * @method loadBodies
     */
    loadBodies: function () {
        console.log('### start bodies')
        for (var b = 0, lb = this.json.box2d.bodies.body.length; b < lb; b++) {
            var body = this.json.box2d.bodies.body[b]
            console.log('body:', body.name, 'image:', body.image, body)
            var fixtures = body.fixtures.fixture
            console.log('-- fixtures', fixtures.length)
            for (var f = 0, fl = fixtures.length; f < fl; f++) {
                console.log('--- fixture #' + (f + 1), fixtures[f])
            }

        }

    },
    /**
     * @description is this method needed? use MediaAsset loader instead or extend MediaAsset with in game "preloading"?
     * @method loadImages
     */
    loadImages: function () {
        console.log('### start images')
        for (var i = 0, li = this.json.box2d.images.image.length; i < li; i++) {
            var image = this.json.box2d.images.image[i]
            console.log('-- image #' + ( i + 1 ), image)
        }
    },
    /**
     * @description
     * @method loadJoints
     */
    loadJoints: function () {
        console.log('### start joints')
        for (var j = 0, lj = this.json.box2d.joints.joint.length; j < lj; j++) {
            var joint = this.json.box2d.joints.joint[j]
            console.log('-- joint #' + (j + 1), joint)
        }
    }
})

/*

//Example is using LibGDX with the Artemis Entity System Framework
public class FizzXLoader {

    public float BOX_WORLD_TO = 30f;
    HashMap bodiesMap;
    HashMap jointsMap;
    HashMap imageMap;
    HashMap atlasMap;

    public void load(String path, World world, float xOffset, float yOffset) {
        FileHandle fileHandle = Gdx.files.internal(path);

        JsonReader reader = new JsonReader();
        JsonValue map = reader.parse(fileHandle);
        bodiesMap = new HashMap();
        jointsMap = new HashMap();
        imageMap = new HashMap();
        atlasMap = new HashMap();

        JsonValue box2dEntry = map.getChild("box2D");

        for (JsonValue entry = box2dEntry; entry != null; entry = entry.next()) {

            if (entry.name.equals("images")) {

                JsonValue joints = entry.getChild("image");
                for (JsonValue jointJsonValue = joints; jointJsonValue != null; jointJsonValue = jointJsonValue
                    .next()) {
                    JsonValue pathJsonValue = jointJsonValue.get("-path");
                    JsonValue nameJsonValue = jointJsonValue.get("-name");
                    JsonValue atlasJsonValue = jointJsonValue.get("-atlas");
                    String atlasString = atlasJsonValue.asString();
                    if (!atlasString.equals("null")) {
                        TextureAtlas textureAtlas = new TextureAtlas(
                            Gdx.files.internal("data/"
                                + atlasJsonValue.asString() + ".txt"));
                        String[] splitName = pathJsonValue.asString().split(
                            "\\.");
                        atlasMap.put(splitName[0], textureAtlas);
                    }

                    imageMap.put(nameJsonValue.asString(),
                        pathJsonValue.asString());
                }
            }

            else if (entry.name.equals("bodies")) {
                JsonValue bodies = entry.getChild("body");
                for (JsonValue bodyJsonValue = bodies; bodyJsonValue != null; bodyJsonValue = bodyJsonValue
                    .next()) {
                    Float xValue = bodyJsonValue.getFloat("-x");
                    Float yValue = bodyJsonValue.getFloat("-y");
                    String typeValue = bodyJsonValue.getString("-type");
                    boolean bulletValue = bodyJsonValue.getBoolean("-bullet");
                    String nameValue = bodyJsonValue.getString("-name");
                    String imagePath = bodyJsonValue.getString("-image");

                    imageMap.put(nameValue, imagePath);
                    JsonValue fixturesValue = bodyJsonValue
                        .getChild("fixtures");

                    BodyDef bodyDef = new BodyDef();

                    bodyDef.bullet = bulletValue;
                    bodyDef.position.x = xValue / BOX_WORLD_TO + xOffset;
                    bodyDef.position.y = yValue / BOX_WORLD_TO + yOffset;

                    if (typeValue.equals("kinematic")) {
                        bodyDef.type = BodyType.KinematicBody;
                    } else if (typeValue.equals("static")) {
                        bodyDef.type = BodyType.StaticBody;
                    } else if (typeValue.equals("dynamic")) {
                        bodyDef.type = BodyType.DynamicBody;
                    }

                    Entity entity = world.createEntity();
                    world.getManager(TagManager.class).register(nameValue,
                        entity);
                    SpatialComponent component = PhysicsFactory
                        .createBody(bodyDef);

                    entity.addComponent(component);
                    if (!imagePath.equals("null")) {
                        String[] splitName = imagePath.split("\\.");

                        if (atlasMap.containsKey(splitName[0])) {
                            TextureComponent textureComponent = new TextureComponent(
                                atlasMap.get(splitName[0]).findRegion(
                                    splitName[0]), new Vector2(0, 0));
                            entity.addComponent(textureComponent);
                        }
                    }

                    entity.addToWorld();
                    component.name = nameValue;
                    bodiesMap.put(nameValue, component.body);

                    JsonValue fixtureEntry = fixturesValue.child();

                    for (JsonValue fixture = fixtureEntry; fixture != null; fixture = fixture
                        .next()) {
                        String fixtureName = fixture.getString("-name");
                        String shapeType = fixture.getString("-shapeType");
                        float friction = fixture.getFloat("-friction");
                        float restitution = fixture.getFloat("-restitution");
                        float density = fixture.getFloat("-density");

                        JsonValue vertexValue = fixture.getChild("vertex");
                        FixtureDef fixtureDef = new FixtureDef();
                        fixtureDef.density = density;
                        fixtureDef.restitution = restitution;
                        fixtureDef.friction = friction;

                        Shape shape = null;
                        if (shapeType.equals("polygonShape")) {
                            ArrayList verticesList = new ArrayList();

                            JsonValue vertexEntry = vertexValue;

                            if (vertexEntry != null) {

                                for (JsonValue vertex = vertexEntry; vertex != null; vertex = vertex
                                    .next()) {

                                    Float vertexX = vertex.getFloat("-x");
                                    Float vertexY = vertex.getFloat("-y");

                                    Vector2 vector2 = new Vector2();
                                    vector2.x = vertexX / BOX_WORLD_TO;
                                    vector2.y = vertexY / BOX_WORLD_TO;

                                    verticesList.add(vector2);

                                }
                            }

                            shape = new PolygonShape();

                            Vector2[] vertices = new Vector2[verticesList
                                .size()];
                            vertices = verticesList.toArray(vertices);

                            float[] floatVertices = new float[vertices.length * 2];

                            ((PolygonShape) shape).set(vertices);

                            fixtureDef.isSensor = fixture
                                .getBoolean("-isSensor");

                        } else if (shapeType.equals("edgeShape")) {
                            shape = new ChainShape();

                            ArrayList verticesList = new ArrayList();

                            JsonValue vertexEntry = vertexValue;

                            if (vertexEntry != null) {

                                for (JsonValue vertex = vertexEntry; vertex != null; vertex = vertex
                                    .next()) {
                                    JsonValue vertexX = vertex.get("-x");
                                    JsonValue vertexY = vertex.get("-y");

                                    Vector2 vector2 = new Vector2();
                                    vector2.x = vertexX.asFloat()
                                        / BOX_WORLD_TO;
                                    vector2.y = vertexY.asFloat()
                                        / BOX_WORLD_TO;

                                    verticesList.add(vector2);

                                }
                            }

                            Vector2[] vertices = new Vector2[verticesList
                                .size()];
                            vertices = verticesList.toArray(vertices);

                            ((ChainShape) shape).createChain(vertices);

                        } else if (shapeType.equals("circleShape")) {
                            shape = new CircleShape();
                            JsonValue circleRadiusJsonValue = fixture
                                .get("-circleRadius");
                            ((CircleShape) shape)
                        .setRadius(circleRadiusJsonValue.asFloat()
                                / BOX_WORLD_TO);

                            float circleX = fixture.getFloat("-circleX");
                            float circleY = fixture.getFloat("-circleY");

                            ((CircleShape) shape).setPosition(new Vector2(
                                circleX / BOX_WORLD_TO, circleY
                                    / BOX_WORLD_TO));
                            fixtureDef.isSensor = fixture
                                .getBoolean("-isSensor");

                        }

                        fixtureDef.shape = shape;
                        PhysicsFactory.createFixture(fixtureDef, component);
                    }

                }
            } else if (entry.name.equals("joints")) {

                JsonValue joints = entry.getChild("joint");
                for (JsonValue jointJsonValue = joints; jointJsonValue != null; jointJsonValue = jointJsonValue
                    .next()) {
                    JsonValue nameJsonValue = jointJsonValue.get("-name");
                    JsonValue typeJsonValue = jointJsonValue.get("-type");
                    JsonValue collideConnected = jointJsonValue
                        .get("-collideConnected");
                    JsonValue xJsonValue = jointJsonValue.get("-x");
                    JsonValue yJsonValue = jointJsonValue.get("-y");
                    JsonValue bodyAJsonValue = jointJsonValue.get("-bodyA");
                    JsonValue bodyBJsonValue = jointJsonValue.get("-bodyB");

                    JointDef jointDef = null;
                    if (typeJsonValue.asString().equals("RevoluteJoint")) {
                        jointDef = new RevoluteJointDef();
                        RevoluteJointDef revoluteJointDef = (RevoluteJointDef) jointDef;

                        Body bodyA = bodiesMap.get(bodyAJsonValue.asString());
                        Body bodyB = bodiesMap.get(bodyBJsonValue.asString());

                        JsonValue enableLimit = jointJsonValue
                            .get("-enableLimit");
                        JsonValue lowerAngle = jointJsonValue
                            .get("-lowerAngle");
                        JsonValue upperAngle = jointJsonValue
                            .get("-upperAngle");

                        revoluteJointDef.enableLimit = enableLimit.asBoolean();
                        revoluteJointDef.lowerAngle = lowerAngle.asFloat();
                        revoluteJointDef.upperAngle = upperAngle.asFloat();

                        Vector2 anchor = new Vector2(xJsonValue.asFloat()
                            / BOX_WORLD_TO, yJsonValue.asFloat()
                            / BOX_WORLD_TO);
                        revoluteJointDef.initialize(bodyA, bodyB, anchor);

                    } else if (typeJsonValue.asString().equals("WeldJoint")) {
                        jointDef = new WeldJointDef();
                        WeldJointDef weldJointDef = (WeldJointDef) jointDef;

                        Body bodyA = bodiesMap.get(bodyAJsonValue.asString());
                        Body bodyB = bodiesMap.get(bodyBJsonValue.asString());
                        Vector2 anchor = new Vector2(xJsonValue.asFloat()
                            / BOX_WORLD_TO, yJsonValue.asFloat()
                            / BOX_WORLD_TO);
                        weldJointDef.initialize(bodyA, bodyB, anchor);

                    }

                    jointDef.collideConnected = collideConnected.asBoolean();

                    Joint joint = PhysicsFactory.createJoint(jointDef);

                    jointsMap.put(nameJsonValue.asString(), joint);
                }

            }

        }
    }
}
*/

