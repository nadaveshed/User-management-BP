
package sql;

import java.sql.ResultSet;
import java.util.ArrayList;

/**
 *
 * @author nadav
 */
public class User {

    private int userId;
    private String firstName;
    private String lastName;
    private String email;
    private ArrayList<Measurements> measurements;

    public User(ResultSet rs) {
        try {
            this.userId = rs.getInt("id");
            this.firstName = rs.getString("first_name");
            this.lastName = rs.getString("last_name");
            this.email = rs.getString("email");
            this.measurements = new ArrayList<>();
        } catch (Exception exp) {
            exp.printStackTrace();
        }
    }
    
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public ArrayList<Measurements> getMeasurements() {
        return measurements;
    }

    public void setMeasurements(ArrayList<Measurements> measurements) {
        this.measurements = measurements;
    }

    public String getFirstName() {
        return firstName;
    }
    
    public void addMeasurements(ResultSet rs) {
         this.measurements.add(new Measurements(rs));
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
