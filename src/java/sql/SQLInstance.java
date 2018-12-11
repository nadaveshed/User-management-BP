
package sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;


final public class SQLInstance {

    private static SQLInstance instance;
    private static String url = "jdbc:mysql://localhost/data?port=3306&useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=true&serverTimezone=UTC&autoReconnect=true&character_set_server=utf8mb4&characterEncoding=UTF-8&useSSL=false&user=root&password=1234";
    private final String GET_LATEST_USER_ID = "SELECT MAX(id) as id FROM data.users";
    private final String ADD_USER = "insert into data.users (first_name, last_name, email) values (?, ?, ?)";
    private final String GET_USERS = "select * from data.users";
    private final String GET_MEASUREMENTS = "select * from data.measurements";
    private final String ADD_MEASUREMENTS = "insert into data.measurements (user_id, date, systolic, diastolic) values (?, ?, ?, ?)";

    private Connection connection;

    public static void main(String[] args) {
        SQLInstance.getInstance();
        try {
            
        } catch (Exception exp) {
            exp.printStackTrace();
        }
    }

    public static SQLInstance getInstance() {
        if (instance == null) {
            try {
                instance = new SQLInstance();
            } catch (Exception exp) {
                exp.printStackTrace();
            }
        }
        return instance;
    }

    private SQLInstance() throws SQLException {
        this.initInstance();
    }

    private void initInstance() throws SQLException {
        DriverManager.registerDriver(new com.mysql.jdbc.Driver());
        this.connection = DriverManager.getConnection(url);
    }

    public void addUser(String fname, String lname, String email) throws SQLException {
        PreparedStatement preparedStmt = connection.prepareStatement(ADD_USER);
        preparedStmt.setString(1, fname);
        preparedStmt.setString(2, lname);
        preparedStmt.setString(3, email);
        preparedStmt.execute();
    }

    private int getLatestUserId() throws SQLException {
        ResultSet rs = connection.createStatement().executeQuery(GET_LATEST_USER_ID);
        if (rs.next()) {
            return rs.getInt("id");
        } else {
            return -1;
        }
    }

    public void addMeasurement(int userId, int systolic, int diastolic) throws SQLException {
        if (userId < 0) {
            return;
        }

        PreparedStatement preparedStmt = connection.prepareStatement(ADD_MEASUREMENTS);
        preparedStmt.setInt(1, userId);
        preparedStmt.setTimestamp(2, new Timestamp(new Date().getTime()));
        preparedStmt.setInt(3, systolic);
        preparedStmt.setInt(4, diastolic);
        preparedStmt.execute();
    }

    public ArrayList<User> getUsers() throws SQLException {
        ResultSet rs = connection.createStatement().executeQuery(GET_USERS);
        ArrayList<User> toReturn = new ArrayList<>();
        if (!rs.next()) {
            return null;
        }
        do {
            toReturn.add(new User(rs));
        } while (rs.next());
        fetchMeasurements(toReturn);
        return toReturn;
    }

    public void fetchMeasurements(ArrayList<User> users) throws SQLException {
        if (users == null || users.size() <= 0) {
            return;
        }
        ResultSet rs = connection.createStatement().executeQuery(GET_MEASUREMENTS);
        if (!rs.next()) {
            return;
        }
        do {
            User tempUser = getUser(users, rs.getInt("user_id"));
            if (tempUser != null) {
                tempUser.addMeasurements(rs);
            }
        } while (rs.next());
    }

    private User getUser(ArrayList<User> users, int userId) {
        for (User u : users) {
            if (u.getUserId() == userId) {
                return u;
            }
        }
        return null;
    }
}
